<template>
    <t-radio-group
    v-model="view"
    variant="default-filled"
    style="margin-bottom: 10px;"
    >
        <t-radio-button value="weeks"><t-icon name="chart-colum"></t-icon></t-radio-button>
        <t-radio-button value="hours"><t-icon name="chart-bar"></t-icon></t-radio-button>
    </t-radio-group>
    <Weeks :data="data.week" v-if="view === 'weeks'" />
    <Hours :data="data.hour" v-if="view === 'hours'" />
</template>

<script>
import Weeks from './Weeks.vue'
import Hours from './Hours.vue'

export default {
    components: {
        Weeks,
        Hours
    },
    props: ['data'],
    setup(){
        const view = ref('weeks')

        return {
            view
        }
    }
}
</script>

<style>

</style>