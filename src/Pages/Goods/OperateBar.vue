<template>
    <t-alert style="padding: 5px 12px; position: sticky; top: 65px;">
        <template #icon><div></div></template>
        <t-space size="12px">
            <span style="line-height: 30px;">
                <t-icon name="check-rectangle" v-if="data.length > 0 && selectKey.length == data.length" />
                <t-icon name="minus-rectangle" v-if="selectKey.length > 0 && selectKey.length < data.length" />
                <t-icon name="close-rectangle" v-if="selectKey.length == 0" />
                <span style="vertical-align: middle; margin-left: 3px;">
                    {{ i18n.selected(selectKey.length)[i18n.language] }}
                </span>
            </span>
            <t-button
            variant="text"
            theme="primary"
            :disabled="selectKey.length === 0"
            :title="i18n.selected(selectKey.length)[i18n.language]"
            @click="() => {
                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/goods/batch-edit') >= 0){
                    $emit('batchEdit')
                } else {
                    tips('权限不足', 'error')
                }
            }">
                <template #icon>
                    <t-icon name="edit" />
                </template>
                {{ getString('batch') }}{{ getString('edit') }}
            </t-button>
            <t-button
            variant="text"
            theme="primary"
            @click="() => {
                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/goods/supplier/map') >= 0){
                    $emit('supplierMap')
                } else {
                    tips('权限不足', 'error')
                }
            }">
                <template #icon>
                    <t-icon name="arrow-up-down-2" />
                </template>
                {{ getString('supplier') }}{{ getString('mapping') }}
            </t-button>
            <t-button
            variant="text"
            theme="primary"
            @click="$router.push('/import')"
            >
                <template #icon>
                    <t-icon name="upload" />
                </template>
                {{ getString('informationImport') }}
            </t-button>
            <span style="line-height: 30px; cursor: pointer;">
                <t-switch :custom-value="['cost-col', '']" v-model="costHighlight" @change="costHightLightChange" />
                <span
                style="vertical-align: middle; margin-left: 6px; color: var(--td-brand-color); user-select: none;"
                @click="() => {
                    costHighlight = costHighlight === 'cost-col' ? '' : 'cost-col'
                    costHightLightChange(costHighlight)
                }"
                >
                    {{ getString('cost') }}{{ getString('highlight') }}
                </span>
            </span>
        </t-space>
    </t-alert>
</template>

<script>
import {tips} from "../../hooks/tips.js";
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString, tips},
    props: {
        data: {
            type: Array,
            default: []
        },
        selectKey: {
            type: Array,
            default: []
        },
        categoryOptions: {
            type: Array,
            required: true,
            default: []
        },
        supplierOptions: {
            type: Array,
            default: []
        },
        loading: {
            type: Boolean,
            default: false
        },
        exportLoading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['batchEdit', 'supplierMap', 'costHightLightChange'],
    setup(props, { emit }){
        const i18n = inject('i18n')
        const user = inject('user')

        const costHighlight = ref('cost-col')
        const costHightLightChange = (value) => {
            localStorage.setItem('cost-highlight', value)
            emit('costHightLightChange', costHighlight.value)
        }
        onMounted(() => {
            if(typeof(localStorage.getItem('cost-highlight')) === 'string'){
                costHighlight.value = localStorage.getItem('cost-highlight')
                costHightLightChange(costHighlight.value)
            }
        })

        return {
            i18n,
            user,
            costHighlight,
            costHightLightChange
        }
    }
}
</script>

<style>

</style>