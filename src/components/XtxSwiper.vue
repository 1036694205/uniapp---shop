<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'

//指示点默认高亮的点
const activeIndex = ref(0)

//ev的类型由UniHelper提供，使用SwiperOnChange类型
const onChange: UniHelper.SwiperOnChange = (ev) => {
  // console.log(ev.detail?.current)  !非空断言，主观排除空值情况
  activeIndex.value = ev.detail!.current
}
//定义props接受
defineProps<{
  list: BannerItem[]
}>()
</script>

<template>
  <view class="carousel">
    <!-- 轮播图  触发onChange事件，改变高亮点 -->
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
:host {
  display: block;
  height: 280rpx;
}

/* 轮播图 */
.carousel {
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;

  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;

    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }

    .active {
      background-color: #fff;
    }
  }

  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
