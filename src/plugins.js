import Vue from 'vue'
 
// 防止重复提交指令v-prevent-re-click
const preventReClick = Vue.directive('preventReClick', {
  inserted (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 1500)
      }
    })
  }
})
 
export { preventReClick }