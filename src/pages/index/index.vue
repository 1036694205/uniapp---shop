<script setup lang="ts">
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import type { XtxGuessInstance } from '@/types/component'
import PageSkeleton from './components/PageSkeleton.vue'
import { useGuessList } from '@/components'

const bannerList = ref<BannerItem[]>([])
const CategoryList = ref<CategoryItem[]>([])
const HomeHotList = ref<HotItem[]>([])

const getHomeBannerDate = async () => {
  const res = await getHomeBannerAPI()
  console.log(res)
  bannerList.value = res.result
}

const getHomeCategoryDate = async () => {
  const res = await getHomeCategoryAPI()
  CategoryList.value = res.result
}

const getHomeHotDate = async () => {
  const res = await getHomeHotAPI()
  HomeHotList.value = res.result
}

//是否加载中的标记
const isLoading = ref(false)

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerDate(), getHomeCategoryDate(), getHomeHotDate()])
  isLoading.value = false
})

//获取猜你喜欢组件实例
// const guessRef = ref<XtxGuessInstance>()
// //滚动触底
// const onScrolltolower = () => {
//   // console.log('daodi')
//   guessRef.value?.getMore()
// }
const { guessRef, onScrolltolower } = useGuessList()

//当前下拉刷新状态
const isTriggered = ref(false)
//自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  //开始动画
  isTriggered.value = true
  //加载数据   使用await 异步加载
  // await getHomeBannerDate()
  // await getHomeCategoryDate()
  // await getHomeHotDate()

  //重置猜你喜欢组件数据  先重置，再获取新数据
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerDate(),
    getHomeCategoryDate(),
    getHomeHotDate(),
    guessRef.value?.getMore(),
  ]) //只需等一次，不适用promise.all 等待三次
  //关闭动画
  isTriggered.value = false
}
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 滚动容器  增加滚动触底事件   refresher-enabled开启上拉刷新   refresherrefresh刷新数据  加入：为响应式数据refresher-triggered-->
  <scroll-view
    refresher-enabled
    @refresherrefresh="onRefresherrefresh()"
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrolltolower"
    class="scroll-view"
    scroll-y
  >
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <!-- 自定义轮播图     配置导入的类型显示   在compenents.d.ts文件中-->
      <XtxSwiper :list="bannerList" />
      <!-- 分类面板 -->
      <CategoryPanel :list="CategoryList" />
      <!-- 热门推荐 -->
      <HotPanel :list="HomeHotList" />
      <!-- 猜你喜欢 -->
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #e9e9e9;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
