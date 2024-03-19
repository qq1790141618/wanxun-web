<template>
    <t-loading v-if="loading" style="width: 100%; height: 100px;" size="small" text="加载中..." />
    <div v-if="!loading" class="flexb">
        <div
        class="inform-card"
        v-for="item in data"
        :key="item.uid"
        v-show="item.uid !== user.inform.uid"
        >
            <t-avatar size="60px" :image="item.headsrc" style="margin-top: 30px;" @click="() => { if(item.headsrc != null) { images = [item.headsrc]; imagePreview = true } }">
                {{ item.realname.substr(0, 1) }}
            </t-avatar>
            <div style="margin-bottom: 12px;">
                <h2>
                    {{ item.realname }}
                </h2>
                <div>
                    {{ i18n.uid[i18n.language] }}:
                    {{ item.uid }}
                </div>
                <div>
                    {{ i18n.nickname[i18n.language] }}:
                    {{ item.nickname }}
                </div>
                <div>
                    {{ i18n.phone[i18n.language] }}:
                    {{ item.phone }}
                </div>
                <div>
                    {{ i18n.hiredate[i18n.language] }}:
                    {{ item.hiredate }}
                </div>
                <div>
                    {{ i18n.mail[i18n.language] }}:
                    {{ item.mail }}
                </div>
            </div>
        </div>
    </div>
    <t-image-viewer
    v-model="imagePreview"
    :images="images"
    >
    </t-image-viewer>
</template>

<script setup>
import { GetAllUserInform } from '../../hooks'
const i18n = inject('i18n')
const user = inject('user')
const data = ref([])
const loading = ref(false)
const images = ref([])
const imagePreview = ref(false)

const getData = async () => {
    loading.value = true
    let res = await GetAllUserInform()
    data.value = res.user
    loading.value = false
}

onMounted(() => {
    getData()
})
</script>

<style scoped>
.flexb{
    display: grid;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
}
.inform-card {
    height: auto;
    background-color: rgba(255, 255, 255);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border-radius: 12px;
    -webkit-border-radius: 12px;
    color: rgba(50, 50, 50, 0.75);
    padding: 16px 24px;
    display: flex;
    gap: 20px;
}

</style>