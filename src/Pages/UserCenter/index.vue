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
                        <t-col :span="3" class="description-title">{{ i18n.username[i18n.language] }}</t-col>
                        <t-col :span="3" class="description-title">{{ i18n.nickname[i18n.language] }}</t-col>
                        <t-col :span="3" class="description-title">{{ i18n.phone[i18n.language] }}</t-col>
                        <t-col :span="3" class="description-title">{{ i18n.mail[i18n.language] }}</t-col>
                        <t-col :span="3">{{ user.inform.username }}</t-col>
                        <t-col :span="3" v-if="!informEdit.isEdit">{{ user.inform.nickname }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-input v-model="informEdit.data.nickname" size="small" clearable></t-input>
                        </t-col>
                        <t-col :span="3">{{ user.inform.phone }}</t-col>
                        <t-col :span="3">{{ user.inform.mail }}</t-col>
                        <t-col :span="3" class="description-title">{{ i18n.hiredate[i18n.language] }}</t-col>
                        <t-col :span="3" class="description-title">{{ i18n.birthday[i18n.language] }}</t-col>
                        <t-col :span="6" class="description-title">{{ i18n.location[i18n.language] }}</t-col>
                        <t-col :span="3" v-if="!informEdit.isEdit">{{ user.inform.hiredate }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-date-picker v-model="informEdit.data.hiredate" size="small" clearable style="width: 100%;"></t-date-picker>
                        </t-col>
                        <t-col :span="3" v-if="!informEdit.isEdit">{{ user.inform.birthday }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-date-picker v-model="informEdit.data.birthday" size="small" clearable style="width: 100%;"></t-date-picker>
                        </t-col>
                        <t-col :span="6" v-if="!informEdit.isEdit">{{ user.inform.locationDisplay }}</t-col>
                        <t-col :span="3" v-if="informEdit.isEdit">
                            <t-cascader
                            v-model="informEdit.data.location"
                            :options="options"
                            clearable
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
                            nocancel
                            />
                        </t-col>
                    </t-row>
                </t-card>
                <div
                class="card-containter"
                style="margin-top: 12px;"
                >
                    <h3>{{ i18n.colleagueInfo[i18n.language] }}</h3>
                    <ColleagueView />
                </div>
                <!-- <iframe
                src="https://u.ali213.net/games/paopaodragon/index.html?game_code=281"
                frameborder="0"
                style="margin-top: 10px; width: 100%; height: 600px;"
                v-if="bubbleShooterHd >= 5"
                >
                </iframe> -->
            </t-col>
            <t-col :span="3">
                <t-card
                :bordered="false"
                >
                    <template #header>
                        <span>{{ i18n.moreOperate[i18n.language] }}</span>
                    </template>
                    <t-space direction="vertical" style="margin-top: -10px; width: 100%;" size="8px">
                        <t-button
                        variant="outline"
                        @click.stop="edpw.open()"
                        block
                        >
                            <template #icon>
                                <t-icon name="user-locked" />
                            </template>
                            {{ i18n.editPassword[i18n.language] }}
                        </t-button>
                        <t-button
                        variant="outline"
                        block
                        @click.stop="edph.open()"
                        >
                            <template #icon>
                                <t-icon name="mobile" />
                            </template>
                            {{ i18n.edit[i18n.language] }}
                            {{ i18n.phone[i18n.language] }}
                        </t-button>
                        <t-button
                        variant="outline"
                        block
                        @click.stop="edem.open()"
                        >
                            <template #icon>
                                <t-icon name="mail" />
                            </template>
                            {{ i18n.edit[i18n.language] }}
                            {{ i18n.mail[i18n.language] }}
                        </t-button>
                    </t-space>
                </t-card>
                <t-button @click="bubbleShooterHdClick" block style="margin-top: 10px;">
                    Bubble Shooter HD
                </t-button>
            </t-col>
        </t-row>
    </div>
    <EditAvatar ref="editAvatarDialog" />
    <EditPassword ref="edpw" />
    <EditMail ref="edem" />
    <EditPhone ref="edph" />
</template>

<script>
import EditAvatar from './EditAvatar.vue'
import confirmBar from '../../components/confirmBar.vue'
import EditPassword from './EditPassword.vue'
import EditMail from './EditMail.vue'
import EditPhone from './EditPhone.vue'
import ColleagueView from './ColleagueView.vue'
import { updateUserInfo, translate } from '../../hooks'

export default {
    components: {
        EditAvatar,
        EditPassword,
        confirmBar,
        EditMail,
        EditPhone,
        ColleagueView
    },
    setup(){
        const i18n = inject('i18n')
        const user = inject('user')
        const serve = inject('serve')

        const editAvatarDialog = ref(null)
        const informEdit = ref({
            isEdit: false,
            data: {},
            loading: false,
            done: async () => {
                informEdit.value.loading = true

                await updateUserInfo({
                    uid: user.inform.uid,
                    nickname: informEdit.value.data.nickname,
                    hiredate: informEdit.value.data.hiredate,
                    birthday: informEdit.value.data.birthday,
                    location: informEdit.value.data.location
                })
                user.inform.nickname = informEdit.value.data.nickname
                user.inform.hiredate = informEdit.value.data.hiredate
                user.inform.birthday = informEdit.value.data.birthday
                user.inform.location = informEdit.value.data.location

                MessagePlugin.success(i18n.editSuccess[i18n.language])
                await initLocation()
                informEdit.value.loading = false
                informEdit.value.isEdit = false
            }
        })

        const locationFormat = async (location) => {
            return fetch(serve + '/user/location/format?location=' + location)
            .then(res => {
                return Promise.resolve(res.json())
            })
        }
        const initLocation = async () => {
            let res = await locationFormat(user.inform.location)
            let f = await translate(res.result, i18n.language)
            user.inform.locationDisplay = f.trans_result[0].dst
        }
        const locationOption = async (level, parent_id = false) => {
            let url = serve + '/user/location/options?level=' + level + '&language=' + i18n.language
            if(parent_id){
                url += '&parent_id=' + parent_id
            }

            return fetch(url)
            .then(res => {
                return Promise.resolve(res.json())
            }) 
        }
        const options = ref([])
        const initOptions = async (node) => {
            return new Promise(async (resolve) => {
                let level = ['countries', 'states', 'cities']
                let res = await locationOption(level[node.level + 1], node.value)
                return resolve(res.result)
            })
        }
        const initEditData = () => {
            informEdit.value.data.nickname = user.inform.nickname
            informEdit.value.data.hiredate = user.inform.hiredate
            informEdit.value.data.birthday = user.inform.birthday
            informEdit.value.data.location = user.inform.location
        }
        const initUserLocationOptions = async () => {
            let l = user.inform.location.split('-')
            let level = ['countries', 'states', 'cities']
            options.value = (await locationOption(level[0])).result

            for (let i = 0; i < options.value.length; i++) {
                if(options.value[i].value == l[0]){
                    options.value[i].children = (await locationOption(level[1], l[0])).result

                    for (let r = 0; r < options.value[i].children.length; r++) {
                        if(options.value[i].children[r].value == l[0] + '-' + l[1]){
                            options.value[i].children[r].children = (await locationOption(level[2], l[0] + '-' + l[1])).result
                        }
                    }
                }
            }
        }
        const access_token = localStorage.getItem('access_token')
        const edpw = ref(null)
        const edph = ref(null)
        const edem = ref(null)

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

        const bubbleShooterHd = ref(0)
        const bubbleShooterHdClick = () => {
            bubbleShooterHd.value++
            if(bubbleShooterHd.value >= 5) {
                window.open('https://www.msn.cn/zh-cn/play/games/bubble-shooter-hd/cg-9nzvl6gzqhkj', "newwindow","height=520, width=520, top=280, left=700, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
                bubbleShooterHd.value = 0
            }
        }

        return {
            i18n,
            user,
            editAvatarDialog,
            informEdit,
            initEditData,
            initOptions,
            options,
            access_token,
            edpw,
            edph,
            edem,
            bubbleShooterHd,
            bubbleShooterHdClick
        }
    }
}
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