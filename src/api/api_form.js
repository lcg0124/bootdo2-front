/**
 * Created by bootdo.
 * 表单相关api
 */
import * as API from './'

export default {
  //
  saveForm: params => {
    return API.POST('/form/save', params)
  },
}
