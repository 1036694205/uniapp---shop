import type { AddressItem } from '@/types/address'
import { defineStore } from 'pinia'
import { ref } from 'vue'

//定义一个独立的store  名称叫address
export const useAddressStore = defineStore('address', () => {
  //获取选中收货地址的数据
  const selecteAddress = ref<AddressItem>()
  //对应的修改函数   接受的参数为收获地址
  const changeSelectedAddress = (val: AddressItem) => {
    selecteAddress.value = val
  }

  return {
    selecteAddress,
    changeSelectedAddress,
  }
})
