<script setup lang="ts">
import { getMemberAddressAPI } from '@/services/address'
import { getMemberOrderPreAPI } from '@/services/order'
import { useAddressStore } from '@/stores/modules/address'
import type { AddressItem } from '@/types/address'
import type { OrderPreResult } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'

//子调用父组件
const emit = defineEmits<{
  (event: 'close'): void
}>()

//获取收货地址列表数据
const addressList = ref<AddressItem[]>([])
const getMemberAddressData = async () => {
  const res = await getMemberAddressAPI()
  addressList.value = res.result
}

//获取订单信息  在这为了获取默认地址！！  也可以不用这个函数
const orderPre = ref<OrderPreResult>()
const getMemberOrderPreData = async () => {
  const res = await getMemberOrderPreAPI()
  // console.log("我是order")
  // console.log(res)
  orderPre.value = res.result
}

onMounted(() => {
  getMemberAddressData()
  getMemberOrderPreData()
})

//修改收获地址    改变收货地址
const addressStore = useAddressStore()
const onChangeAddress = (item: AddressItem) => {
  //修改地址
  addressStore.changeSelectedAddress(item)
  emit('close')
}

//收货地址
const selecteAddress = computed(() => {
  //查找数组里是否有默认的选项    点击后的数据||  地址的默认值
  return addressStore.selecteAddress || orderPre.value?.userAddresses.find((v) => v.isDefault)
})
</script>

<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item" v-for="item in addressList" :key="item.id" @tap="onChangeAddress(item)">
        <view class="user">{{ item.receiver }} {{ item.contact }}</view>
        <view class="address">{{ item.fullLocation }} {{ item.address }}</view>
        <text
          v-if="item.fullLocation === selecteAddress?.fullLocation"
          class="icon icon-checked"
        ></text>
      </view>
    </view>
    <view class="footer">
      <navigator class="button primary" url="/pagesMember/address-form/address-form">
        新建地址
      </navigator>
      <view v-if="false" class="button primary">确定</view>
    </view>
  </view>
</template>

<style lang="scss">
.address-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;

  .item {
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-size: 40rpx;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
    position: relative;
  }

  .icon {
    color: #999;
    font-size: 40rpx;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
  }

  .icon-checked {
    color: #27ba9b;
  }

  .icon-ring {
    color: #444;
  }

  .user {
    font-size: 28rpx;
    color: #444;
    font-weight: 500;
  }

  .address {
    font-size: 26rpx;
    color: #666;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .primary {
    color: #fff;
    background-color: #27ba9b;
  }

  .secondary {
    background-color: #ffa868;
  }
}
</style>
