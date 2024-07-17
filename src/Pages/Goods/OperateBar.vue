<template>
    <t-alert style="padding: 5px 12px; position: sticky; top: 65px;">
        <template #icon><div></div></template>
        <t-space size="12px">
            <span style="line-height: 30px;">
                <t-icon name="check-rectangle" v-if="data.length > 0 && selectKey.length === data.length" />
                <t-icon name="minus-rectangle" v-if="selectKey.length > 0 && selectKey.length < data.length" />
                <t-icon name="close-rectangle" v-if="selectKey.length === 0" />
                <span style="vertical-align: middle; margin-left: 3px;">
                    {{ i18n.selected(selectKey.length)[i18n.language] }}
                </span>
            </span>
<!--            <t-button-->
<!--            variant="text"-->
<!--            theme="primary"-->
<!--            :disabled="selectKey.length === 0"-->
<!--            :title="i18n.selected(selectKey.length)[i18n.language]"-->
<!--            @click="$emit('batchEdit')">-->
<!--                <template #icon>-->
<!--                    <t-icon name="edit" />-->
<!--                </template>-->
<!--                {{ getString('batch') }}{{ getString('edit') }}-->
<!--            </t-button>-->
            <t-button
                variant="text"
                theme="primary"
                @click="$emit('exportSearchGoods')"
                :loading="exportCreateLoading"
            >
                <template #icon>
                    <t-icon name="file-export" />
                </template>
                {{ getString('exportQueryGoods') }}
            </t-button>
            <t-button
                variant="text"
                theme="primary"
                @click="$emit('neverUploadGoods')"
                :loading="neverUploadGoodsLoading"
            >
                <template #icon>
                    <t-icon name="data-error" />
                </template>
                {{ getString('neverUploadGoods') }}
            </t-button>
            <t-button
                variant="text"
                theme="primary"
                :disabled="selectKey.length === 0"
                @click="copy(selectKey.join('\n'), i18n.language)"
            >
                <template #icon>
                    <t-icon name="copy" />
                </template>
                {{ getString('copyStyleNumber') }}
            </t-button>
            <t-button
                variant="text"
                theme="primary"
                @click="$emit('supplierMap')"
            >
                <template #icon>
                    <t-icon name="arrow-up-down-2" />
                </template>
                {{ getString('supplier') }}{{ getString('mapping') }}
            </t-button>
            <t-button
                variant="text"
                theme="primary"
                @click="$router.push('/task')"
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
import {copy} from "../../hooks/index.js";

export default {
    methods: {copy, getString, tips},
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
        },
        exportCreateLoading: {
            type: Boolean,
            default: false
        },
        neverUploadGoodsLoading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['batchEdit', 'supplierMap', 'costHightLightChange', 'exportSearchGoods', 'neverUploadGoods'],
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