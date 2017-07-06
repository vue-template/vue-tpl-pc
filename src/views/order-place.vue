<template>
  <Form class="order-place" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <section class="info-panel">
      <Form-item label="出发地" prop="onSitePoi">
        <Row>
          <Col span="5">
            <Select v-model="formValidate.onSiteCity" placeholder="城市" filterable @on-change="formValidate.onSitePoi = ''">
              <Option v-for="item in formValidate.onCityList()" :value="item.code" :key="item.code" :label="item.city">
                {{item.city}}<span hidden>{{item.pinyins}}</span>
              </Option>
            </Select>
          </Col>
          <Col span="1">&nbsp;</Col>
          <Col span="18">
            <Select v-model="formValidate.onSitePoi" placeholder="请填写出发地" filterable remote :remote-method="remoteOnSite" :loading="loading">
              <Option v-for="(item, index) in formValidate.onOptions" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </Col>
        </Row>
      </Form-item>

      <Form-item label="目的地" prop="offSitePoi">
        <Row>
          <Col span="5">
            <Select v-model="formValidate.offSiteCity" placeholder="城市" filterable remote :remote-method="remoteOffCity" :loading="loading" @on-change="formValidate.offSitePoi = ''">
              <Option v-for="item in formValidate.offCityList" :value="item.code" :key="item.code" :label="item.city">
                {{item.city}}
              </Option>
            </Select>
          </Col>
          <Col span="1">&nbsp;</Col>
          <Col span="18">
            <Select v-model="formValidate.offSitePoi" placeholder="请填写目的地" filterable remote :remote-method="remoteOffSite" :loading="loading">
              <Option v-for="(item, index) in formValidate.offOptions" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </Col>
        </Row>
      </Form-item>
    </section>

    <header class="type-tab">
      <ul>
        <li :class="{'active': formValidate.currentType==1}" @click="switchType(1)" data-mtaid="chartered.order_place.tab_单程">单程</li>
        <li :class="{'active': formValidate.currentType==2}" @click="switchType(2)" data-mtaid="chartered.order_place.tab_往返">往返</li>
        <li :class="{'active': formValidate.currentType==3}" @click="switchType(3)" data-mtaid="chartered.order_place.tab_包车">包车</li>
      </ul>
      <i></i>
    </header>

    <section class="info-panel">
      <Form-item label="出发时间" class="ivu-form-item-required">
        <Row>
          <Col span="11">
            <Form-item prop="onDate">
              <Date-picker type="date" :options="dateOption" placeholder="请选择出发日期" v-model="formValidate.onDate"></Date-picker>
            </Form-item>
          </Col>
          <Col span="1">&nbsp;</Col>
          <Col span="12">
            <Form-item prop="onTime">
              <Time-picker type="time" format="HH:mm" placeholder="请选择出发时间" v-model="formValidate.onTime"></Time-picker>
            </Form-item>
          </Col>
        </Row>
      </Form-item>

      <Form-item v-if="formValidate.currentType == 2 || formValidate.currentType == 3" label="返程时间" class="ivu-form-item-required">
        <Row>
          <Col span="11">
            <Form-item prop="offDate">
              <Date-picker type="date" :options="dateOption" placeholder="请选择返程日期" v-model="formValidate.offDate"></Date-picker>
            </Form-item>
          </Col>
          <Col span="1">&nbsp;</Col>
          <Col span="12">
            <Form-item prop="offTime">
              <Time-picker type="time" format="HH:mm" placeholder="请选择返程时间" v-model="formValidate.offTime"></Time-picker>
            </Form-item>
          </Col>
        </Row>
      </Form-item>

      <Form-item label="乘车人数" prop="number">
        <Input v-model="formValidate.number" placeholder="请输入乘车人数" :maxlength="4"></Input>
      </Form-item>


      <Form-item label="联系人" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入联系人姓名"></Input>
      </Form-item>

      <Form-item label="联系电话" prop="mobile">
        <Input v-model="formValidate.mobile" placeholder="请输入手机号码" :maxlength="11"></Input>
      </Form-item>

      <Form-item label="备注信息">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2, maxRows: 5}" :maxlength="100" placeholder="可以输入用车数量、车辆类型，是否包含路桥费、停车费、食宿费等补充信息"></Input>
      </Form-item>

      <section class="info-btn">
        <Button type="primary" size="large" @click="handleSubmit">提交行程</Button>
      </section>

    </section>
  </Form>
</template>

<script>
  import ddb from '../assets/js/ddb/'
  import moment from 'moment'
  import AMap from 'AMap'
  import CITYS from '../assets/js/cities'

  export default {
    data () {
      return {
        mapObj: {},
        loading: false,
        debounce: null, // 函数防抖

        // 表单数据&验证
        formValidate: {
          currentType: 1, // 类型:1-单程 2-往返 3-包车

          onSiteCity: '',
          onCityList: () => {
            return CITYS.filter(
              item => ['028', '010', '0755', '020', '021', '029', '027', '023', '0731'].join(',').indexOf(item.code) >= 0
            ).map(item => {
              item.pinyins = item.pinyin.join('') + item.pinyin.map(i => i.substr(0, 1)).join('')
              return item
            })
          },
          onSitePoi: '',
          onDate: '',
          onTime: '',
          onOptions: [], // 远程获取地址

          offSiteCity: '',
          offCityList: [],
          offSitePoi: '',
          offDate: '',
          offTime: '',
          offOptions: [], // 远程获取地址

          number: '',
          name: '',
          mobile: '',
          desc: ''
        },
        ruleValidate: {
          onSitePoi: [{
            required: true,
            message: '请填写出发地',
            trigger: 'change'
          }],
          offSitePoi: [{
            required: true,
            message: '请填写目的地',
            trigger: 'change'
          }],
          onDate: [{
            type: 'date',
            required: true,
            message: '请选择出发日期',
            trigger: 'change'
          }],
          offDate: [{
            type: 'date',
            required: true,
            message: '请选择返程日期',
            trigger: 'change'
          }],
          onTime: [{
            type: 'date',
            required: true,
            message: '请选择出发时间',
            trigger: 'change'
          }, {
            validator: (rule, value, callback) => {
              const onDate = this.formValidate.onDate
              if (onDate && value) {
                const onTime = moment(onDate).format('YYYY-MM-DD ') + moment(value).format('HH:mm')
                const targetTime = moment().add(2, 'hours')
                if (moment(onTime).isBefore(targetTime)) {
                  return callback(new Error('出发时间须在2小时以后'))
                }
              }
              callback()
            },
            trigger: 'change'
          }],
          offTime: [{
            type: 'date',
            required: true,
            message: '请选择返程时间',
            trigger: 'change'
          }, {
            validator: (rule, value, callback) => {
              const onDate = this.formValidate.onDate
              const onTime = moment(onDate).format('YYYY-MM-DD ') + moment(this.formValidate.onTime).format('HH:mm')
              const offDate = this.formValidate.offDate
              if (onDate && onTime && offDate && value) {
                const offTime = moment(offDate).format('YYYY-MM-DD ') + moment(value).format('HH:mm')
                if (!moment(onTime).isBefore(offTime)) {
                  return callback(new Error('返程时间必须在出发时间之后'))
                }
              }
              callback()
            },
            trigger: 'change'
          }],
          number: [{
            required: true,
            message: '请填写乘车人数',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (!Number.isInteger(Number(value))) {
                return callback(new Error('乘车人数须为正整数'))
              }
              if (Number(value) <= 0 || value.substr(0, 1) === '0') {
                return callback(new Error('乘车人数须为正整数'))
              }
              callback()
            },
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请填写联系人',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
                return callback(new Error('您填写的联系人姓名有误，请输入中文名'))
              }
              callback()
            },
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请填写联系电话',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (value.length !== 11) {
                return callback(new Error('您填写的手机号码有误，请确认号码为11位数'))
              }
              if (!/^1\d{10}$/.test(value)) {
                return callback(new Error('您填写的手机号码有误，请重新填写'))
              }
              callback()
            },
            trigger: 'blur'
          }]
        },

        dateOption: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000 // 减了整整1天
          }
        }
      }
    },

    computed: {
      onSiteData () {
        const pois = this.formValidate.onSitePoi
        return pois ? JSON.parse(pois) : {}
      },
      offSiteData () {
        const pois = this.formValidate.offSitePoi
        return pois ? JSON.parse(pois) : {}
      }
    },

    created () {
      this.geoLocation(result => {
        this.formValidate.onSiteCity = result.addressComponent.citycode || ''
      })
    },

    methods: {
      geoLocation (onComplete) {
        const ddbGps = ddb.session('ddb-gps')
        if (ddbGps && ddbGps.info === 'SUCCESS') {
          onComplete(ddbGps)
        } else {
          AMap.plugin(['AMap.Geolocation'], () => {
            this.mapObj.geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 10000, // 超过10秒后停止定位，默认：无穷大
              maximumAge: 0, // 定位结果缓存0毫秒，默认：0
              convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: false, // 显示定位按钮，默认：true
              // buttonDom: $('#location_section1 .mapButton .icon.reset').get(0),
              buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 10), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 10)
              showMarker: false, // 定位成功后在定位到的位置显示点标记，默认：true
              showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            })

            this.mapObj.geolocation.getCurrentPosition((status, result) => {
              if (status === 'complete') {
                onComplete(result)
                ddb.session('ddb-gps', result)
              }
            })
          })
        }
      },

      autoComplete (keyword, city = '全国', callback) {
        AMap.service('AMap.PlaceSearch', () => { // 回调函数
          // 实例化PlaceSearch
          this.mapObj.placeSearch = new AMap.PlaceSearch({
            city: city,
            extensions: 'all',
            pageSize: 10
          })

          this.mapObj.placeSearch.search(keyword, (status, result) => {
            if (status === 'complete') {
              callback(result.poiList.pois)
            } else if (status === 'no_data') {
              callback([])
            } else {
              callback([])
            }
          })
        })
      },

      remoteOffCity (query) {
        if (query) {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.formValidate.offCityList = CITYS.filter(
              item => (item.city + item.pinyin.join('') + item.pinyin.map(i => i.substr(0, 1)).join('')).indexOf(query) >= 0
            )
          }, 0)
        }
      },

      remoteOnSite (query) {
        this.formValidate.onOptions = []
        if (query) {
          this.loading = true
          clearTimeout(this.debounce)
          this.debounce = setTimeout(() => {
            this.autoComplete(query, this.formValidate.onSiteCity || undefined, pois => {
              this.loading = false
              if (pois.length) {
                const list = pois.map(item => ({
                  value: JSON.stringify(item),
                  label: item.name
                }))
                this.formValidate.onOptions = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
              }
            })
          }, 100)
        }
      },

      remoteOffSite (query) {
        this.formValidate.offOptions = []
        if (query) {
          this.loading = true
          clearTimeout(this.debounce)
          this.debounce = setTimeout(() => {
            this.autoComplete(query, this.formValidate.offSiteCity || undefined, pois => {
              this.loading = false
              if (pois.length) {
                const list = pois.map(item => ({
                  value: JSON.stringify(item),
                  label: item.name
                }))
                this.formValidate.offOptions = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
              }
            })
          }, 100)
        }
      },

      switchType (type) {
        this.formValidate.currentType = +type
      },

      getDistance (p, callback) {
        AMap.service(['AMap.Driving'], function() { // 驾车导航获取距离
          const driving = new AMap.Driving()
          driving.search(
            new AMap.LngLat(p.onSiteLng, p.onSiteLat),
            new AMap.LngLat(p.offSiteLng, p.offSiteLat)
          )
          // 返回导航查询结果
          AMap.event.addListener(driving, 'complete', data => {
            callback(Math.min(...data.routes.map(item => item.distance)))
          })
        })
      },

      handleSubmit () {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.submitOrder()
          }
        })
      },

      submitOrder () {
        this.loading = true
        ddb.loading()

        const formData = this.formValidate
        const onSitePoi = this.onSiteData
        const offSitePoi = this.offSiteData
        const startTime = moment(formData.onDate).format('YYYY-MM-DD') + moment(formData.onTime).format(' HH:mm:ss')
        const endTime = moment(formData.offDate).format('YYYY-MM-DD') + moment(formData.offTime).format(' HH:mm:ss')

        this.getDistance({
          onSiteLng: onSitePoi.location.lng,
          onSiteLat: onSitePoi.location.lat,
          offSiteLng: offSitePoi.location.lng,
          offSiteLat: offSitePoi.location.lat
        }, distance => {
          const postData = {
            trip_type: +formData.currentType,
            start_time: startTime,
            start_city_code: onSitePoi.citycode,
            start_area_code: onSitePoi.adcode,
            start_lng: onSitePoi.location.lng,
            start_lat: onSitePoi.location.lat,
            start_place_detail: onSitePoi.name,
            end_city_code: offSitePoi.citycode,
            end_area_code: offSitePoi.adcode,
            end_lng: offSitePoi.location.lng,
            end_lat: offSitePoi.location.lat,
            end_place_detail: offSitePoi.name,
            passenger_count: formData.number,
            contact_mobile: formData.mobile,
            contact_name: formData.name,
            distance: distance,
            user_comments: formData.desc
          }

          // 往返和包车
          if (+formData.currentType === 2 || +formData.currentType === 3) {
            Object.assign(postData, {
              end_time: endTime
            })
          }

          // 有填写备注
          if (formData.desc) {
            Object.assign(postData, {
              user_comments: formData.desc
            })
          }

          ddb.post('chartered/submit_order', postData).then(res => {
            if (+res.ret === 0) {
              this.$Message.success('提交行程成功!')
              this.$router.push('/chartered/order-list')
              this.loading = false
              ddb.hideloading()
            } else {
              ddb.tips(res.msg)
              this.loading = false
              ddb.hideloading()
            }
          }).catch(() => {
            this.loading = false
            ddb.hideLoading()
          })
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .info-panel
    clear: both
    margin: 0 auto
    width: 480px

  .info-btn
    text-align: center

  .type-tab
    display: table
    position: relative
    margin: 20px 0
    width: 100%
    > ul
      display: table
      margin: 0 auto
      > li
        display: block
        float: left
        width: 176px
        height: 40px
        line-height: 40px
        font-size: 14px
        color: #495060
        text-align: center
        cursor: pointer
        z-index: 2
        &.active
          color: #ff9c00
          background: url(../assets/img/switch-tab.png) center center no-repeat
          background-size: contain
    > i
      display: block
      margin-top: -1px
      width: 100%
      height: 1px
      background: #d7d7d7
</style>
