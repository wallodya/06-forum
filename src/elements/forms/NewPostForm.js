import { FilePond, File, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileRename from "filepond-plugin-file-rename"
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostTextInput } from './PostTextInput'
import { useLogin } from '../../context/LoginProvider'
import { useMutation, useQueryClient } from 'react-query'
import { saveNewPost } from '../../api/api'
import { useUser } from '../../context/UserProvider'

registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileRename,
    FilePondPluginFileMetadata,
    FilePondPluginFileValidateSize
)

export const NewPostForm = ({onSubmit : toggleModal}) => {
    const [files, setFiles] = useState([])
    const pond = useRef()
    const queryClient = useQueryClient()
    // const navigate = useNavigate()
    const textField = React.createRef()
    const loginFailMessage = useRef()
    const [isLoginFailMessageShown, setIsLoginFailMessageShown] = useState(false)
    const { uuid } = useLogin()
    const { userOwner : { uuid : uuidOwner } } = useUser()
    const [postText, setPostText] = useState('')

    const { mutate : handlePostUpload } = useMutation(() => {
        saveNewPost({
            author: uuid,
		    owner: uuidOwner,
		    text: postText,
		    imageURL: `http://62.113.97.215/post/`,
		    imageName: `postimageby_${uuid}.jpg`
        })
    }, {
        onMutate: () => {
                
        },
        onError: () => {
            console.log('error')
            setIsLoginFailMessageShown(true)
        },
        onSuccess: () => {
            setFiles([])
            setPostText('')
            toggleModal()
            queryClient.invalidateQueries(['posts', uuidOwner])
        }
    })
    return (
        <div className="container-flex-column">

            <form
                autoComplete="off"
                className="container-flex-column  container-login-form"
                onChange={() => {
                    setIsLoginFailMessageShown(false)
                }}
                onSubmit={(event) => {
                    event.preventDefault()
                    handlePostUpload()
                }}
            >

                <h1 className="ff-heading fs-xl fw-bold text-gradient full-width">New post</h1>

                <FilePond
                    ref={pond}
                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                    maxFileSize={'1MB'}
                    files={files}
                    server={{
                        url: `http://62.113.97.215/api`,
                        process: {
                            url: '/post/loadImage',
                            method: 'PUT',
                            mode: 'no-cors',
                            onload: data => {
                                const { key } = JSON.parse(data)
                                console.log('key: ', key)
                                return key
                            },
                            onerror: err => err.data
                        },
                        revert: (key, load, err) => {
                            console.log('UFID: ', key)
                            fetch(`http://62.113.97.215/api/post/loadImage`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ id: key })
                            })
                                .then(() => setFiles(null))
                                .catch(err => console.log('Error in fetch revert: ', err))

                            err('revert error')
                            load()
                        }
                    }}
                    imageResizeTargetWidth={200}
                    imageResizeTargetHeight={200}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    name="postImage"
                    labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                    styleItemPanelAspectRatio={1 / 1}
                    stylePanelAspectRatio={1 / 1}
                    fileRenameFunction={(file) => {
                        return `${(file.name = "postimageby_" + uuid + ".jpg")}`;
                    }}
                    onaddfile={(err, file) => {
                        if (err) console.log('Error in filepond={', err)
                        setFiles(file)
                        console.log('getMetaData: ', file.getMetadata())
                    }}
                    onprocessfile={(err, file) => {
                        if (err) console.log('Error in onprocessfile: ', err)
                    }}
                />
                <PostTextInput ref={textField} onChange={setPostText}/>

                <p
                    className="fw-bold fs-s text-accent-100"
                    style={{
                        display: isLoginFailMessageShown ? 'block' : 'none'
                    }}
                    ref={loginFailMessage}
                >
                    Error
                </p>

                <input
                    type="submit"
                    value="Submit"
                    className={
                        !!(files[0] || postText)
                            ? "button-primary full-width margin-top-m"
                            : "button-primary-disabled full-width margin-top-m"
                    }
                />

            </form>
        </div>
    )
}
