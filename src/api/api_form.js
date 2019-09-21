/**
 * Created by bootdo.
 * 表单相关api
 */
import * as API from './'

export default {
  get:id=>{
    return API.GET('/form/'+id,{})
  },
  list: params => {
    return API.GET('/form', params)
  },
  saveForm: params => {
    return API.POST('/form/save', params)
  },
}
