<template>
    <div id="user-center">
        <t-row
        :gutter="[12, 12]"
        style="width: 100%;"
        >
            <t-col :span="12">
                <t-card :bordered="false">
                    <div class="user-card">
                        <t-image-viewer
                        :images="[user.inform.headsrc]"
                        >
                            <template #trigger="{ open }">
                                <t-image
                                :src="user.inform.headsrc"
                                class="user-avatar"
                                shape="circle"
                                @click="() => {
                                    if(user.inform.headsrc){
                                        open
                                    }
                                }"
                                >
                                    <template #overlay-content>
                                        <t-button
                                        variant="outline"
                                        shape="circle"
                                        class="edit-avatar-button"
                                        @click.stop="() => {
                                            editAvatarDialog.open(user.inform.headsrc)
                                        }"
                                        >
                                            <template #icon>
                                                <t-icon name="camera" />
                                            </template>
                                        </t-button>
                                    </template>
                                    <template #loading><div></div></template>
                                    <template #error><div></div></template>
                                </t-image>
                            </template>
                        </t-image-viewer>
                        <div class="user-nickname">
                            {{ user.inform.nickname }}
                        </div>
                        <t-space align="center" size="5px">
                            <t-tag size="small">UID</t-tag>
                            <span>{{ user.inform.uid }}</span>
                        </t-space>
                    </div>
                </t-card>
            </t-col>
            <t-col :span="9">
                <t-card
                :bordered="false"
                >
                    <template #header>
                        <span>个人信息</span>
                        <t-button
                        variant="text"
                        size="small"
                        shape="square"
                        @click.stop="() => {
                            initEditData()
                            informEdit.isEdit = !informEdit.isEdit
                        }"
                        >
                            <template #icon>
                                <t-icon name="edit" v-if="!informEdit.isEdit" />
                                <t-icon name="close" v-if="informEdit.isEdit" />
                            </template>
                        </t-button>
                    </template>
                    <t-row style="margin-top: -10px;" :gutter="[12, 8]">
                        <t-col :span="3" class="description-title">{{ getString('username') }}</t-col>
                        <t-col :span="3" class="description-title">{{ getString('nickname') }}</t-col>
                        <t-col :span="3" class="description-title">{{ getString('phone') }}</t-col>
                        <t-col :span="3" class="description-title">{{ getString('mail') }}</t-col>
                        <t-col :span="3">{{ user.inform.username }}</t-col>
                        <t-col :span="3" v-if="!informEdit.isEdit">{{ user.inform.nickname }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-input v-model="informEdit.data.nickname" size="small" :clearable="true"></t-input>
                        </t-col>
                        <t-col :span="3">{{ user.inform.phone }}</t-col>
                        <t-col :span="3">{{ user.inform.mail }}</t-col>
                        <t-col :span="3" class="description-title">{{ getString('hiredate') }}</t-col>
                        <t-col :span="3" class="description-title">{{ getString('birthday') }}</t-col>
                        <t-col :span="6" class="description-title">{{ getString('location') }}</t-col>
                        <t-col :span="3" v-if="!informEdit.isEdit">{{ user.inform.hiredate }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-date-picker v-model="informEdit.data.hiredate" size="small" :clearable="true" style="width: 100%;"></t-date-picker>
                        </t-col>
                        <t-col :span="3" v-if="!informEdit.isEdit">{{ user.inform.birthday }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-date-picker v-model="informEdit.data.birthday" size="small" :clearable="true" style="width: 100%;"></t-date-picker>
                        </t-col>
                        <t-col :span="6" v-if="!informEdit.isEdit">{{ user.inform.locationDisplay }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-cascader
                            v-model="informEdit.data.location"
                            :options="options"
                            :clearable="true"
                            :load="initOptions"
                            size="small"
                            />
                        </t-col>
                        <t-col :span="12" v-if="informEdit.isEdit">
                            <confirmBar
                            :confirmLoading="informEdit.loading"
                            @confirm="informEdit.done"
                            @reset="initEditData"
                            size="small"
                            :nocancel="true"
                            />
                        </t-col>
                    </t-row>
                </t-card>
<!--                <div-->
<!--                class="card-container"-->
<!--                style="margin-top: 12px;"-->
<!--                >-->
<!--                    <h3>{{ getContent('colleagueInfo') }}</h3>-->
<!--                    <ColleagueView />-->
<!--                </div>-->
            </t-col>
            <t-col :span="3">
                <t-card
                :bordered="false"
                >
                    <template #header>
                        <span>{{ getString('moreOperate') }}</span>
                    </template>
                    <t-space direction="vertical" style="margin-top: -10px; width: 100%;" size="8px">
                        <t-button
                        variant="outline"
                        @click.stop="edpw.open()"
                        :block="true"
                        >
                            <template #icon>
                                <t-icon name="user-locked" />
                            </template>
                            {{ getString('editPassword') }}
                        </t-button>
                        <t-button
                        variant="outline"
                        :block="true"
                        @click.stop="edph.open()"
                        >
                            <template #icon>
                                <t-icon name="mobile" />
                            </template>
                            {{ getString('edit') }}
                            {{ getString('phone') }}
                        </t-button>
                        <t-button
                        variant="outline"
                        :block="true"
                        @click.stop="edem.open()"
                        >
                            <template #icon>
                                <t-icon name="mail" />
                            </template>
                            {{ getString('edit') }}
                            {{ getString('mail') }}
                        </t-button>
                        <t-button @click="bubbleShooterHdClick" shape="round" :block="true" style="margin-top: 10px;">
                            Bubble Shooter HD
                        </t-button>
                    </t-space>
                </t-card>
            </t-col>
        </t-row>
    </div>
    <EditAvatar ref="editAvatarDialog" />
    <EditPassword ref="edpw" />
    <EditMail ref="edem" />
    <EditPhone ref="edph" />
</template>

<script setup>
import EditAvatar from './EditAvatar.vue'
import confirmBar from '../../components/confirmBar.vue'
import EditPassword from './EditPassword.vue'
import EditMail from './EditMail.vue'
import EditPhone from './EditPhone.vue'
import ColleagueView from './ColleagueView.vue'
import { getString } from "../../i18n/index.js"
import { MessagePlugin } from "tdesign-vue-next"
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";

const i18n = inject('i18n')
const user = inject('user')

const edpw = ref(null)
const edph = ref(null)
const edem = ref(null)
const editAvatarDialog = ref(null)
const options = ref([])
const bubbleShooterHd = ref(0)

const informEdit = ref({
    isEdit: false,
    data: {},
    loading: false,
    done: async () => {
        informEdit.value.loading = true

        let res = await service.api.user.saveUserInform({
            nickname: informEdit.value.data['nickname'],
            hiredate: informEdit.value.data['hiredate'],
            birthday: informEdit.value.data['birthday'],
            location: informEdit.value.data['location']
        })

        if(!res.result){
            tips(res.error.message, 'error')
            informEdit.value.loading = false
            return
        }

        user.inform.nickname = informEdit.value.data['nickname']
        user.inform.hiredate = informEdit.value.data['hiredate']
        user.inform.birthday = informEdit.value.data['birthday']
        user.inform.location = informEdit.value.data['location']

        informEdit.value.loading = false
        informEdit.value.isEdit = false

        await MessagePlugin.success(getString('editSuccess'))
        await initLocation()
    }
})

const initLocation = async () => {
    let res = await service.api.userS.locationFormat(user.inform.location)
    if(res.result){
        user.inform.locationDisplay = res.content
    } else {
        tips(res.error.message, 'error')
    }
}

const initOptions = async (node) => {
    return new Promise(async (resolve) => {
        let level = ['countries', 'states', 'cities']
        let res = await service.api.userS.locationOptions(level[node.level + 1], node.value)
        if(!res.result){
            tips(res.error.message, 'error')
            return resolve([])
        }
        return resolve(res.content)
    })
}

const initEditData = () => {
    informEdit.value.data.nickname = user.inform.nickname
    informEdit.value.data.hiredate = user.inform.hiredate
    informEdit.value.data.birthday = user.inform.birthday
    informEdit.value.data.location = user.inform.location
}

const initUserLocationOptions = async () => {
    let location = user.inform.location.split('-')
    location = location.map(item => parseInt(item))

    let level = ['countries', 'states', 'cities']
    let res = await service.api.userS.locationOptions(level[0])
    if(!res.result){
        tips(res.error.message, 'error')
        return
    }
    options.value = res.content

    for (let i = 0; i < options.value.length; i++) {
        if(options.value[i].value === location[0]){
            let res1 = await service.api.userS.locationOptions(level[1], location[0])
            if(!res1.result){
                tips(res1.error.message, 'error')
                return
            }
            options.value[i].children = res1.content

            for (let r = 0; r < options.value[i].children.length; r++) {
                let parentId = location[0] + '-' + location[1]
                if(options.value[i].children[r].value === parentId){
                    let res2 = await service.api.userS.locationOptions(level[2], parentId)
                    if(!res2.result){
                        tips(res2.error.message, 'error')
                        return
                    }
                    options.value[i].children[r].children = res2.content
                }
            }
        }
    }
}

const bubbleShooterHdClick = () => {
    bubbleShooterHd.value++
    if(bubbleShooterHd.value >= 5) {
        window.open('https://www.msn.cn/zh-cn/play/games/bubble-shooter-hd/cg-9nzvl6gzqhkj', "newwindow","height=520, width=520, top=280, left=700, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
        bubbleShooterHd.value = 0
    }
}

watch(() => i18n.language, () => {
    initLocation()
    initUserLocationOptions()
})

onMounted(() => {
    setTimeout(() => {
        initLocation()
        initUserLocationOptions()
    }, 300)
})
</script>

<style>
#user-center{
    width: 1390px;
    margin: 15px auto;
    max-width: calc(100% - 20px);
}
.user-card{
    padding: 20px;
    text-align: center;
}
.user-avatar{
    width: 100px;
    height: 100px;
    margin: 0 auto;
}
.edit-avatar-button{
    position: absolute;
    bottom: 0;
    right: 0;
}
.user-nickname{
    font-size: 15px;
    font-weight: 700;
    margin: 5px;
}
</style>