import React from 'react';
import { useForm } from 'react-hook-form';
import './UploadPage.css';
import userContext from '../context/UserContext';
import { useContext } from 'react';

const UploadPage = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const { user, setUser } = useContext(userContext)


  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append('user_name', user.user_name)
    formData.append('name', data.upload_img[0].name)
    formData.append('date', data.upload_img[0].lastModifiedDate)
    formData.append('upload_img', data.upload_img[0]);

    let res = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      alert("image uploaded")
    } else {
      res = await res.json()
      setError('file', { type: "manual", message: res.error })
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="file">Upload File</label>
        <input
          id="file"
          type="file"
          {...register('upload_img', { required: 'File is required' })}
        />
        {errors.file && <p className="error-message">{errors.file.message}</p>}
      </div>

      <button type="submit" className="upload-button" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadPage;
