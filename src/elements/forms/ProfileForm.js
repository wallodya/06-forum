import React, { useEffect, useRef, useState } from 'react'
import { FilePond, File, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileRename from "filepond-plugin-file-rename"
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import './forms.css'
import './login_form.css'
import { NamePrepop } from './NamePrepop'
import { EmailPrepop } from './EmailPrepop'
import { useLogin, useLoginUpdate } from '../../context/LoginProvider'
import default_prof_pic from '../../lib/img/default_prof_pic.png'
import { useMutation, useQueryClient } from 'react-query'
import { changeProfileData } from '../../api/api'

registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileRename,
    FilePondPluginFileMetadata,
    FilePondPluginFileValidateSize
)

export const ProfileForm = () => {

    const pond = useRef()
    const user = useLogin()
    const updateUser = useLoginUpdate()
    
    const queryClient = useQueryClient()

    const [files, setFiles] = useState([])
    const [nameField, setNameField] = useState(user.name)
    const [emailField, setEmailField] = useState(user.email)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        (
            files[0]
            ||
            nameField !== user.name
            ||
            emailField !== user.email
        )
            ?
            setHasChanges(true)
            :
            setHasChanges(false)
    }, [files, nameField, emailField, hasChanges, user.name, user.email])

    const { mutate : handleSubmit } = useMutation(data => changeProfileData(data), {
        onSuccess: () => {
            updateUser(user.login)
                .then(() => window.location.reload(true))
        }
    })

    return (
        <div className="container-flex-column container-login-form card">

            <form
                autoComplete='off'
                className="container-flex-columnn login-form"
                onSubmit={event => {
                    event.preventDefault()
                    handleSubmit({
                        newAvatar: files[0]?.serverId ?? null,
                        newName: nameField,
                        newEmail: emailField,
                        uuid: user.uuid
                    })
                }
                }
            >
                <h1 className="ff-heading fs-xl fw-bold text-gradient full-width">Edit<br />account</h1>



                <div
                    style={{
                        borderRadius: '50%',
                        backgroundImage:
                            !files[0]
                            ?
                            `url(${user.avatar === '../lib/img/default_prof_pic.png'
                                ||
                                !user.avatar
                                ? default_prof_pic
                                : user.avatar
                            })`
                            :
                            'none',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'var(--clr-primary-100)'
                    }}
                >
                    <FilePond
                        ref={pond}
                        acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                        maxFileSize={'1MB'}
                        files={files}
                        server={{
                            url: `http://62.113.97.215/api`,
                            process: {
                                url: '/user/avatar',
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
                                fetch(`http://62.113.97.215/api/user/avatar`, {
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
                        stylePanelLayout={"compact circle"}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        name="avatar"
                        labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                        styleItemPanelAspectRatio={1 / 1}
                        stylePanelAspectRatio={1 / 1}
                        fileRenameFunction={(file) => {
                            return `${(file.name = "avatar_" + user.uuid + ".jpg")}`;
                        }}
                        onaddfile={(err, file) => {
                            if (err) console.log('Error in filepond={', err)
                            setFiles(file)
                            console.log('getMetaData: ', file.getMetadata())
                        }}
                        onprocessfile={(err, file) => {
                            if (err) console.log('Error in onprocessfile: ', err)
                            console.log('File type: ')
                            console.log(file.fileType)
                        }}
                    />

                </div>



                <LoginPropop login={user.login} />
                <NamePrepop name={user.name} onChange={setNameField} />
                <EmailPrepop email={user.email} onChange={setEmailField} />
                <input
                    type="submit"
                    value="Save changes"
                    className={hasChanges ? "button-primary" : "button-primary-disabled"}
                />
            </form>
        </div>
    )
}

const LoginPropop = ({ login }) => {
    return (
        <input
            type="text"
            placeholder={login}
            name="login"
            minLength="4"
            maxLength="15"
            pattern="[A-z0-9]{4,15}"
            title="Should contain from 4 to 15 characters"
            required
            readOnly
            className="input-field"
        />
    )
}



