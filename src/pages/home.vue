<template>
<div style="width: 100px; height: 100px; background: #e8e8e8">
  <img :src="cargoImg" style="height: 100%" alt="">
</div>
</template>

<script>
import { onMounted, onUnmounted, ref } from '@vue/runtime-core'
import CargoGenerator from '../util/cargoGenerator'
export default {

setup() {
  let cargoGenerator;
  const cargoImg = ref()

  onMounted(() => {
    cargoGenerator = new CargoGenerator({length: 10, width: 10, height: 10});
    cargoGenerator.createCargo()
    cargoImg.value = cargoGenerator.cargoImg
  })

  onUnmounted(() => {
    cargoGenerator.dispose()
  })

  return { cargoImg}
  }
}
</script>

<style>

</style>