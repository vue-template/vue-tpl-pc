<template>
  <div class="agreement">
    <vheader></vheader>

    <div class="main">
      <h1>嗒嗒巴士约车协议</h1>
      <section>
        <h3>一、嗒嗒巴士约车平台</h3>
        <p>嗒嗒巴士科技有限公司致力于向乘客提供更高效便捷、更有价格竞争力的多人出行服务，解决目前市场上多人出行叫车困难的问题。作为平台方，嗒嗒巴士向广大车企提供订单信息派发服务，为接入车企提供流量，促其发展。与此同时，嗒嗒巴士还肩负起对车企相应的资质和信息进行审核、监管，保证乘客出行安全、顺利进行，约束车企及司机的行为，提升服务质量。</p>
      </section>
      <section>
        <h3>二、车企方</h3>
        <p>车企方作为接入嗒嗒巴士约车平台的服务商，在本平台享有获取乘客出行订单信息的权利，应向本平台支付订单金额10%的平台服务费。同时，车企做为服务的直接承接方，应当及时处理乘客发出的订单信息，约束司机行为，监控车况，保证出车的及时、安全，不断提升服务意识，做到让乘客满意。</p>
        <dl>
          <dt><h4>1、对车企的要求</h4></dt>
          <dd>1. 车企应提供真实有效的资质和信息，平台审核通过后，方可接入平台约车服务；</dd>
          <dd>2. 车企应当做对旗下所属司机进行资质和信息审核，对所属司机有监管的义务；</dd>
          <dd>3. 车企应当保证车辆和司机信息的及时更新，确保信息无误和联系畅通；</dd>
          <dd>4. 车企应当安排专门的调度人员对平台线上订单进行及时处理；</dd>
          <dd>5. 对已经接入的订单，车企调度人员应当妥善安排相应的司机和车辆；</dd>
          <dd>6. 如发生司机或车辆调度问题，需要更换的情况，车企调度人员需主动致电联系乘客；</dd>
          <dd>7. 车企应当要求司机在出行前主动对乘车联系人进行联系。 </dd>
          <dt><h4>2、对应的违约规定</h4></dt>
          <dd>车企向乘客提供车辆服务时，如出现以下投诉情况，经核实，嗒嗒巴士约车平台将有权对车企做出相应惩罚：</dd>
          <dd>1． 由于车企或司机方过失，未按照订单约定出车，又未与平台沟通，取消车企约车平台入住资格；</dd>
          <dd>2． 没有按照订单约定时间到达指定位置，视情节严重程度进行处罚款。</dd>
          <dd>3． 实际车辆信息、司机信息、车况等与承诺不符，视情节严重程度进行处罚款。</dd>
          <dd>4． 司机服务态度等其他情况，经核实，视情节严重程度进行处罚款。</dd>
        </dl>
      </section>
      <section>
        <h3>三、乘客（企业）方</h3>
        <p>乘客做为嗒嗒巴士约车平台的用户，享有发送订单，支付后按时、安全用车出行服务的权利。同时，乘客也应当履行支付线上、线下相关费用的义务</p>
        <dl>
          <dt>当乘客因为自身原因，需要取消订单时，应当遵守以下退款规则：</dt>
          <dd>1. 距离出发时间24小时以上，乘客主动取消订单，全额退回订单实付金额，已使用的优惠券不再返还。</dd>
          <dd>2. 距离出发时间4小时以上，乘客主动取消订单，扣除订单实付金额的20%手续费；</dd>
          <dd>3. 距离出发时间2-4小时，乘客主动取消订单，扣除订单实付金额的50%手续费；</dd>
          <dd>4. 距离出发时间2小时以内，乘客主动取消订单，不予退换订单金额。</dd>
          <dd>5. 退款将退回原订单支付账户，一般需要3-5个工作日，具体到账时间受第三方处理流程影响。</dd>
          <dt>乘客享有以下赔付规则权益：</dt>
          <dd>1. 由于车企或司机方原因，订单被取消，经核实，按照乘客订单退款，并按照一比一赔付；</dd>
          <dd>2. 其他原因造成的订单取消，需双方协商一致进行处理。</dd>
          <dd>3. 如果无法与司机或车企沟通达成一致，请致电嗒嗒客服中心：0755-36901227，协同解决。（服务时间，工作日9:00-18:00）</dd>
        </dl>
      </section>
      <footer>
        <p>嗒嗒巴士科技有限公司享有对该规则的最终解释权。</p>
        <p>2017年6月9日</p>
      </footer>
    </div>

    <vfooter></vfooter>
  </div>
</template>

<script>
  import vheader from '../components/header.vue'
  import vfooter from '../components/footer.vue'

  export default {
    components: {
      vheader,
      vfooter
    }
  }
</script>

<style lang="stylus">
  @import '../assets/css/var'
  @import $node-modules-path + 'nib'

  #app > .view.agreement
    .main
      flex 1
      max-width designwidth
      margin 0 auto
      padding 20px
      color $black
      background $silver
      &::before
        visibility hidden
      h1
        text-align center
        font-size 28px
        color $dblack
        font-weight normal
      section
        margin-top 30px
        h3
          font-size 20px
          color $dblack
          font-weight normal
        p
          font-size 14px
          margin-top 5px
        ul
        dl
          font-size 14px
          margin-top 15px
        dt
          margin 15px 0 5px
          font-size 16px
          color $dblack
          h4
            font-size 18px
            font-weight normal
      footer
        font-size 14px
        margin-top 30px
        color $lblack
</style>
