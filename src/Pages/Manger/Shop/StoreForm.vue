<template>
    <t-form
    ref="formRef"
    :colon="true"
    :data="formData"
    :rules="FORM_RULES"
    :label-width="150"
    >
        <t-form-item :label="getString('storeId')" name="id">
            <t-input
                v-model="formData.id"
                @change="$emit('update:form', formData)"
                style="width: 270px;"
                maxlength="10"
                :disabled="type === 'edit'"
            />
        </t-form-item>
        <t-form-item :label="getString('storeName')" name="name">
            <t-input
                v-model="formData.name"
                @change="$emit('update:form', formData)"
                style="width: 270px;"
                maxlength="20"
            />
        </t-form-item>
        <t-form-item :label="getString('storeBrand')" name="brand">
            <t-checkbox-group v-model="formData.brand" @change="$emit('update:form', formData)">
                <t-checkbox
                    v-for="item in shop.brandOptions"
                    :value="item.id"
                >
                    {{ item.name }}
                </t-checkbox>
            </t-checkbox-group>
        </t-form-item>
        <t-form-item :label="getString('deductions')" name="brand">
            <t-input-number
                v-model="formData.deductions"
                @change="$emit('update:form', formData)"
                :step="0.02"
                :max="0.5"
                :min="0.02"
            >
                {{ item.name }}
            </t-input-number>
        </t-form-item>
        <t-form-item :label="getString('storeLocation')" name="location">
            <div style="width: 100%;">
                <t-auto-complete
                    v-model="formData.location"
                    :options="locationOptions"
                    :filterable="false"
                    placeholder="请输入关键词搜索"
                    @change="locationChange"
                    @select="setLocationOption"
                    :clearable="true"
                    :highlight-keyword="true"
                    style="margin-bottom: 10px;"
                />
                <div id="container"></div>
            </div>
        </t-form-item>
    </t-form>
</template>

<script setup>
import { getString } from "../../../i18n/index.js"
import AMapLoader from '@amap/amap-jsapi-loader'

const props = defineProps({
    type: {
        type: String,
        default: 'create'
    },
    form: {
        type: Object,
        default: []
    }
})
const emit = defineEmits(['update:form'])

const shop = inject('shop')
const formRef = ref(null)
const defaultLocation =  [120.579782,30.658788]
let formData = reactive({
    id: null,
    name: null,
    brand: [],
    location: null,
    deductions: 0.2
})
const FORM_RULES = {
    id: [{ required: true, trigger: 'blur' }],
    name: [{ required: true, trigger: 'blur' }]
}
const locationOptions = ref([])
let timer
const locationChange = (value) => {
    emit('update:form', formData)
    clearTimeout(timer)
    timer = setTimeout(async () => {
        let options = await getLocationOptions(value)
        if(options.tips){
            locationOptions.value = []
            for (let i = 0; i < options.tips.length; i++){
                const option = options.tips[i]
                locationOptions.value.push({
                    label: option.district + option.address + option.name,
                    value: option.location.split(',')
                })
            }
        }
    }, 500)
}
const getLocationOptions = (value) => {
    return new Promise((resolve) => {
        fetch('https://restapi.amap.com/v3/assistant/inputtips?output=json&city=010&keywords=' + value + '&key=3ecb03bc1d2614928a3e85dce23d0db5')
            .then(response => {
                resolve(response.json())
            })
            .catch(response => {
                resolve(response.json())
            })
    })
}

const confirm = async () => {
    return await formRef.value.validate()
}
defineExpose({
    confirm
})

let map, marker
const getLocationName = (location) => {
    return new Promise((resolve) => {
        fetch('https://restapi.amap.com/v3/geocode/regeo?output=json&location=' + location.join(',') + '&key=3ecb03bc1d2614928a3e85dce23d0db5&radius=1000&extensions=all')
            .then(response => {
                resolve(response.json())
            })
            .catch(response => {
                resolve(response.json())
            })
    })
}
const getLocationInfo = (locationName) => {
    return new Promise((resolve) => {
        fetch('https://restapi.amap.com/v3/geocode/geo?address=' + locationName + '&output=json&key=3ecb03bc1d2614928a3e85dce23d0db5')
            .then(response => {
                resolve(response.json())
            })
            .catch(response => {
                resolve(response.json())
            })
    })
}
const setLocationName = async (lnglat) => {
    let location = [
        lnglat.lng,
        lnglat.lat
    ]
    let res = await getLocationName(location)
    formData.location = res.regeocode.formatted_address
    emit('update:form', formData)
}
const setLocationOption = async (value) => {
    for(let i = 0; i < locationOptions.value.length; i++){
        if(value === locationOptions.value[i].label){
            const lnglat = new AMap.LngLat(...locationOptions.value[i].value)
            marker.setPosition(lnglat)
            map.setCenter(lnglat)
        }
    }
}

const initAMap = (location) => {
    window._AMapSecurityConfig = {
        securityJsCode: "f06750883748d04d4c89407f78730c87",
    };
    AMapLoader.load({
        key: "672699c5651505b856bf0088b676de29",
        version: "2.0",
        plugins: ["AMap.Scale", "AMap.AutoComplete"],
    })
        .then((AMap) => {
            map = new AMap.Map("container", {
                viewMode: "2D", // 是否为3D地图模式
                zoom: 16, // 初始化地图级别
                center: location, // 初始化地图中心点位置
            })

            marker = new AMap.Marker({
                position: new AMap.LngLat(...location), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                offset: new AMap.Pixel(0, 0), //设置点标记偏移量
                anchor: "bottom-center",
            })
            map.add(marker)

            map.on("click", function (ev) {
                marker.setPosition(ev.lnglat)
                setLocationName(ev.lnglat)
            })
        })
        .catch((e) => {
            console.log(e)
        })
}

onMounted(async () => {
    formData.id = props.form.id
    formData.name = props.form.name
    formData.brand = props.form.brand ? props.form.brand : []

    if(props.form.location){
        formData.location = props.form.location
        let res = await getLocationInfo(props.form.location)
        if(res.geocodes){
            const lnt = res.geocodes[0].location.split(',')
            initAMap(lnt)
        } else {
            initAMap(defaultLocation)
        }
    } else {
        initAMap(defaultLocation)
    }

})
onUnmounted(() => {
    map?.destroy()
})
</script>

<style scoped>
#container{
    width: 100%;
    height: 360px;
}
</style>