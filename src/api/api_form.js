/**
 * Created by bootdo.
 * 表单相关api
 */
import * as API from './'

export default {
  list: params => {
    return API.GET('/form', params)
  },
  saveForm: params => {
    return API.POST('/form/save', params)
  },
}
