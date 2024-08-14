import Orequest from '@/utils/Orequest'
import request from '@/utils/request'

export function addFileData(data) {
    return request({
        url: 'AddFileManagementData',
        method: 'post',
        data
    })
}

export function getFileData(data) {
    return request({
        url: 'GetFileManagementData',
        method: 'post',
        data
    })
}

export function deleteFileData(data) {
    return request({
        url: 'DeleteFileManagementData',
        method: 'post',
        data
    })
}