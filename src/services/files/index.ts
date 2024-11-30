import { useMutation } from 'react-query'
import { onError } from '../../utils/error-handlers'
import useAxiosIns from '../../hooks/useAxiosIns'
import { RcFile } from 'rc-upload/lib/interface'

export default () => {
    const axios = useAxiosIns()
    const uploadMutation = useMutation({
        mutationFn: ({ file, folder }: { file: string | Blob | RcFile; folder: string }) => {
            const form = new FormData()
            form.append('file', file)
            return axios.postForm(`/file/upload-image?folder=${folder}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        },
        onError: onError
    })

    const deleteMutation = useMutation({
        mutationFn: (imageUrl: string) => axios.post('/file/delete-image', { imageUrl }),
        onError: onError
    })

    return { uploadMutation, deleteMutation }
}
