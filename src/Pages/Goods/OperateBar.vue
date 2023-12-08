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
            @click="$emit('batchEdit')"
            :disabled="selectKey.length == 0"
            :title="i18n.selected(selectKey.length)[i18n.language]"
            >
                <template #icon>
                    <t-icon name="edit" />
                </template>
                {{ i18n.batch[i18n.language] }}{{ i18n.edit[i18n.language] }}
            </t-button>
            <t-button
            variant="text"
            theme="primary"
            @click="$emit('exportToFiles')"
            :disabled="loading || exportLoading"
            :loading="exportLoading"
            >
                <template #icon>
                    <t-icon name="file-export" />
                </template>
                {{ exportLoading ? i18n.exporting[i18n.language] : i18n.exportQueryGoods[i18n.language] }}
            </t-button>
            <t-button
            variant="text"
            theme="primary"
            @click="$emit('supplierMap')"
            >
                <template #icon>
                    <t-icon name="arrow-up-down-2" />
                </template>
                {{ i18n.supplier[i18n.language] }}{{ i18n.mapping[i18n.language] }}
            </t-button>
            <t-button
            variant="text"
            theme="primary"
            @click="$router.push('/import')"
            >
                <template #icon>
                    <t-icon name="upload" />
                </template>
                {{ i18n.informationImport[i18n.language] }}
            </t-button>
            <span style="line-height: 30px; cursor: pointer;">
                <t-switch :custom-value="['cost-col', '']" v-model="costHighlight" @change="costHightLightChange" />
                <span
                style="vertical-align: middle; margin-left: 6px; color: var(--td-brand-color); user-select: none;"
                @click="() => {
                    costHighlight = costHighlight == 'cost-col' ? '' : 'cost-col'
                    costHightLightChange(costHighlight)
                }"
                >
                    {{ i18n.cost[i18n.language] }}{{ i18n.highlight[i18n.language] }}
                </span>
            </span>
        </t-space>
    </t-alert>
</template>

<script>
export default {
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
    emits: ['batchEdit', 'exportToFiles', 'supplierMap', 'costHightLightChange'],
    setup(props, { emit }){
        const i18n = inject('i18n')

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
            costHighlight,
            costHightLightChange
        }
    }
}
</script>

<style>

</style>