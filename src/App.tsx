import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import UploadModal from './components/uploadModal';
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';

type UploadProgress = {
  [key: string]: {
    status: boolean,
    error: string,
    load: number
  };
};

type FetchImages = {
  _id: string,
  url: string,
  dbState: boolean,
  size: string
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fetchFiles, setFetchFiles] = useState<FetchImages[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [blobState, setBlobState] = useState<Blob>();
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,

  })
  const imgRef = useRef<HTMLImageElement | null>(null);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openUploadModal = () => {
    FetchImages()
    setUploadModalVisible(true)
  };
  const closeUploadModal = () => setUploadModalVisible(false);

  const FetchImages = async () => {
    try {
      const images = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-image`);
      setFetchFiles(images.data?.images);
      setFiles([])
    } catch (error) {

    }
  }
  useEffect(() => {
    if (fetchFiles.length > 0) {
      let imageURL = fetchFiles.filter((item) => item.dbState === true).map(item => item.url)
      console.log("imageURL", imageURL);
      setProfileImage(imageURL?.length > 0 ? imageURL[0] : null)
    }
  }, [fetchFiles])
  useEffect(() => {
    FetchImages()
  }, [])

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFiles(files)
    const promises: Promise<any>[] = [];
    const progress: UploadProgress = {};
    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        if (file.size < 5 * 1024 * 1024) {
          const promise = axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData, {
            onUploadProgress: (event) => {
              const total = event.total || event.loaded;
              if (event.loaded === total) {
                progress[file.name] = { status: true, load: Math.round((100 * event.loaded) / total), error: "" };
              } else {
                progress[file.name] = { status: true, load: Math.round((100 * event.loaded) / total), error: "" };
              }
              setUploadProgress({ ...progress });
            },
          }).catch(error => {

            if (error.response) {
              // The request was made and the server responded with a status code
              if (error.response.status >= 400 && error.response.status < 500) {
                progress[file.name] = {
                  status: false,
                  error: 'Client Error: ' + error.response.data.message,
                  load: 0
                };
              } else if (error.response.status >= 500 && error.response.status < 600) {
                progress[file.name] = {
                  status: false,
                  error: 'An unexpected error occurred during the upload. Please contact support if the issue persists.',
                  load: 0
                };
              } else {
                progress[file.name] = {
                  status: false,
                  error: 'Unexpected Error: ' + error.response.data.message,
                  load: 0
                };
              }
            } else if (error.request) {
              console.log("error", error)
              // The request was made but no response was received
              progress[file.name] = {
                status: false,
                error: 'An error occurred during the upload. Please check your network connection and try again.',
                load: 0
              };
            } else {
              // Something happened in setting up the request that triggered an error
              progress[file.name] = {
                status: false,
                error: 'Error: ' + error.message,
                load: 0
              };
            }
            setUploadProgress({ ...progress });
          });

          promises.push(promise);
        } else {
          progress[file.name] = { status: false, error: "This image is larger than 5MB. Please select a smaller image.", load: 0 };
          setUploadProgress({ ...progress });
        }
      } else {
        progress[file.name] = {
          status: false,
          error: "The file format of IMG_0080.pcx is not supported. Please upload an image in one of the following formats: JPG or PNG.",
          load: 0
        };
      }
      console.log("progress", progress)


    });
    await Promise.all(promises).then((res) => {

    });
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }
  const displayFileSize = (file: File) => {
    const fileSize = file.size; // size in bytes
    let sizeInKB = fileSize / 1024;
    let sizeInMB = sizeInKB / 1024;
    if (sizeInMB >= 1) {
      return `${sizeInMB.toFixed(2)} MB`;
    } else {
      return `${sizeInKB.toFixed(2)} KB`;
    }
  }
  const displayUploadedFileSize = (file: FetchImages) => {
    const fileSize: number = Number(file.size); // size in bytes
    let sizeInKB = fileSize / 1024;
    let sizeInMB = sizeInKB / 1024;
    if (sizeInMB >= 1) {
      return `${sizeInMB.toFixed(2)} MB`;
    } else {
      return `${sizeInKB.toFixed(2)} KB`;
    }
  }
  const displayImage = (file: File) => {
    let fileUrl;
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      fileUrl = URL.createObjectURL(file)
    } else {
      fileUrl = "./assets/img/damage.png"
    }
    return fileUrl
  }
  const removeFile = (index: number) => {
    setFiles((preFile) => preFile.filter((_, i) => i !== index))
  }
  const removeApiCall = async (id: string) => {
    try {
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/remove/${id}`).then((res) => {
        FetchImages()
      });
    } catch (error) {

    }
  }

  const updateAvatar = async () => {
    try {
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-avatar`, {
        imageid: selectedAvatar
      }).then((res) => {
        FetchImages()
        closeUploadModal()
      });
    } catch (error) {

    }
  }

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setFiles(files);
    const promises: Promise<any>[] = [];
    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      console.log("log", formData);
      const promise = axios.post('https://the-alter-office-backend.onrender.com/upload', formData, {
        onUploadProgress: (event) => {
          // const total = event.total || event.loaded;
          // progress[file.name] = Math.round((100 * event.loaded) / total);
          // setUploadProgress({ ...progress });
        },
      });
      promises.push(promise);
    });
    await Promise.all(promises)
  };
  const onCropComplete = (crop: Crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedBlobFile : Blob = await getCroppedImg(`${process.env.REACT_APP_BACKEND_URL}/images/${profileImage}`, crop );
      setBlobState(croppedBlobFile)
    }
  };
  const uploadCroppedImage = () => {
    const formData = new FormData();
    if(blobState)
    formData.append('file', blobState, 'cropped-image.jpg'); 
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload-crop`, formData).then((res) => {
      closeModal()
    });
  }
  const getCroppedImg = (src: string, crop: Crop): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.crossOrigin = "anonymous"
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width!;
        canvas.height = crop.height!;
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(
          image,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width! * scaleX,
          crop.height! * scaleY,
          0,
          0,
          crop.width!,
          crop.height!
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          // const croppedImageUrl = URL.createObjectURL(blob);
          resolve(blob);
        }, 'image/jpeg');
      };
      image.onerror = (error) => {
        reject(error);
      };
  
    });
  };

  return (
    <div className="bg-custom-gradient flex justify-center  items-center w-full h-screen">
      <div className='bg-white relative rounded-lg border overflow-hidden border-1 w-[90%] md:w-[70%] h-[420px]  mx-[10px]  md:mx-[20px] lg:mx-[20%]'>
        <div className=' bg-custom-image h-[176px] w-full bg-cover bg-right-center'>
        </div>
        <div onClick={openModal} className='cursor-pointer absolute borde top-[130px] md:top-[100px] left-[10px] md:left-[20px] w-[96px] h-[96px] md:w-[160px] md:h-[160px]'>
          {profileImage ? <img alt='profile' className='bg-slate-400 border border-[6px] border-white rounded-full w-[96px] h-[96px] md:w-[160px] md:h-[160px]' src={`${process.env.REACT_APP_BACKEND_URL}/images/${profileImage}`} /> : <img alt='profile' className='bg-slate-400 border border-[6px] border-white rounded-full' src='./assets/img/Vector.png' />}
          {croppedImageUrl && <img src={croppedImageUrl} />}
        </div>
        <div className=''>
          <div className='flex justify-end items-center'>
            <button onClick={openUploadModal} className='shadow py-[7px] md:py-[10px] px-[7px] md:px-[20px] mt-[5px] md:mt-[15px] mr-[10px] md:mr-[15px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded hover:border-1 hover:border-[#E5E5E5] hover:bg-[#FAFAFA] focus:border-1 focus:border-[#E5E5E5] focus:bg-[#E5E5E5] disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3]'>Update picture</button>
          </div>
          <div className='pl-[25px] mt-[15px] md:mt-[30px]'>
            <h2 className='text-[#171717] mb-[18px] text-[20px] md:text-[30px] font-semibold leading-9'>Jack Smith</h2>
            <div className='flex flex-col md:flex-row md:items-center'>
              <p className='font-normal my-1'>@kingjack</p>
              <span className="hidden md:inline-block mx-3 h-[5px] w-[5px] bg-gray-400 rounded-full "></span>
              <p className='my-1'>Senior Product Designer</p>
              <div className='my-1 flex items-center'>
                <p className='ml-0 md:ml-3 mr-3'>at</p>
                <img alt='company' className='w-[20px] h-[15px] mx-[2px]' src='./assets/img/company-logo.png' />
                <p> Webflow</p>
                <span className="mx-3 h-[5px] w-[5px] bg-gray-400 rounded-full inline-block"></span>
                <p>He/Him</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {profileImage && <Modal isVisible={isModalVisible} onClose={closeModal}>
        <ReactCrop  className='w-full h-full' circularCrop crop={crop} onChange={c => setCrop(c)} onComplete={onCropComplete}>
          <img  crossOrigin='anonymous' alt='crop' ref={imgRef} className=' py-[10px] bg-black w-full h-full' src={`${process.env.REACT_APP_BACKEND_URL}/images/${profileImage}`} />
        </ReactCrop>
        <div className='flex mt-3 gap-5 items-center justify-between'>
          <button className='shadow w-full py-[10px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded' onClick={closeModal}>Cancel</button>
          <button onClick={uploadCroppedImage} className='shadow w-full py-[10px] text-white bg-[#4338CA] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Confirm</button>
        </div>
      </Modal>}
      <UploadModal isVisible={isUploadModalVisible} onClose={closeUploadModal}>
        <div onDrop={handleDrop} onDragOver={handleDragOver} className='relative my-3' id="drop-area">
          <input className='hidden'
            type="file"
            id="fileElem"
            multiple
            onChange={handleFileInputChange}
          />
          {fetchFiles.length < 5 ? <label className="p-[10px] cursor-pointer rounded-md h-[192px] flex items-center justify-center border border-1 border-[#E5E5E5] bg-[#FAFAFA]" htmlFor="fileElem">
            <div className='flex flex-col justify-center items-center'>
              <img alt='upload-file' className='w-[48px] h-[48px] ' src='./assets/img/upload-icon.png' />
              <div className="text-[13px] md:text-[18px] lg:text-[14px] text-[#171717] leading-7">Click or drag and drop to upload</div>
              <div className="text-[#525252] text-[14px]">PNG, or JPG (Max 5MB)</div>
            </div>
          </label> :
            <div className='border border-1 border-[#E5E5E5] bg-[#FAFAFA] rounded py-2 flex flex-col justify-center items-center'>
              <div className="text-[13px] md:text-[18px] lg:text-[16px] text-[#DC2626] leading-7 font-semibold">You've reached the image limit</div>
              <div className="text-[#525252] text-[14px]">Remove one or more to upload more images.</div>
            </div>
          }
        </div>
        <div className='overflow-y-auto no-scrollbar h-[300px]' >
          {files.length > 0 && files.map((file, index) => <div key={index} className='my-2 flex justify-between items-start'>
            <div className='flex w-full gap-5'>
              {uploadProgress[file.name]?.status ? <img alt='user-image' className='w-[80px] h-[80px] border border-1 boreder-[#E5E5E5] rounded-md bg-[#FAFAFA]' src={displayImage(file)} /> : <div className='flex items-center justify-center w-[80px] h-[80px] border border-1 boreder-[#E5E5E5] rounded-md bg-[#FAFAFA]'>
                <img alt='user-image' className='w-[24px] h-[26px] ' src="./assets/img/damage.png" />
              </div>}
              <div className='flex w-full flex-col justify-around'>
                <div className='flex justify-between w-full'>
                  <div className=''>
                    <div className='font-semibold text-[#171717] text-[13px] md:text-[16px] leading-7'>{file?.name}</div>
                    <div className='text-[#525252] text-[12px]'>{displayFileSize(file)}</div>
                  </div>
                  <div className='cursor-pointer' ><img alt='remove' onClick={() => removeFile(index)} className='w-[9px] h-[9px]' src='./assets/img/remove.png' /></div>
                </div>
                {uploadProgress[file.name]?.status ? <div className='flex gap-5 items-center'>
                  {uploadProgress[file.name].load < 100 ? <div className="w-full bg-gray-200 rounded-full h-[6px] dark:bg-gray-700">
                    <div className="bg-[#4338CA] h-[6px] rounded-full" style={{ width: `${uploadProgress[file.name]?.load}%` }}></div>
                  </div> : <div className='flex items-center gap-5 text-[12px] font-medium text-[#15803D]'><img alt='tic' className='w-[12px] h-[9px]' src='./assets/img/tic.png' /> Upload success!</div>}
                  {uploadProgress[file.name].load < 100 && <div className='text-[#525252] text-[12px] font-medium'>{uploadProgress[file.name]?.load}%</div>}
                </div> : <div className='text-[#DC2626] text-[12px] font-medium'>{uploadProgress[file.name]?.error}</div>}
              </div>
            </div>
          </div>)}
          {fetchFiles.length > 0 && fetchFiles.map((file, index) => <div key={index} className='my-2 flex justify-between items-start'>
            <div className='flex gap-5 my-1'>
              <img alt='user-image' className='w-[80px] ' src={`${process.env.REACT_APP_BACKEND_URL}/images/${file?.url}`} />
              <div className='flex flex-col justify-between'>
                <div>
                  <div className='font-semibold text-[#171717] text-[13px] md:text-[16px] leading-7'>{file?.url}</div>
                  <div className='text-[#525252] text-[12px]'>{displayUploadedFileSize(file)}</div>
                </div>
                <div className='flex gap-2 xl:gap-6 justify-start items-center'>
                  <button className='text-[10px] md:text-[14px] text-[#525252] flex gap-1 md:gap-4 lg:gap-1 xl:gap-6 leading-5 justify-center items-center'>
                    <img alt="crop-area" className='w-[8px] h-[8px] md:w-[13px] md:h-[13px]' src='./assets/img/crop.png' />
                    Crop Image
                  </button>
                  <button onClick={() => removeApiCall(file?._id)} className='text-[10px] md:text-[14px] text-[#525252] flex gap-1 md:gap-4 lg:gap-1 xl:gap-6 justify-center items-center'>
                    <img alt='delete' className='w-[8px] h-[8px] md:w-[13px] md:h-[13px]' src='./assets/img/delete.png' />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div>
              <input onClick={() => setSelectedAvatar(file?._id)} name='profile' className='hover:border-[#4F46E5] accent-[#4338CA] w-[16px] h-[16px]' type='radio' />
            </div>
          </div>)}
        </div>
        <div className='flex mt-3 gap-5 items-center justify-between'>
          <button type='button' onClick={closeUploadModal} className='shadow w-full py-[10px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Cancel</button>
          <button type='button' onClick={updateAvatar} className='shadow w-full py-[10px] text-white bg-[#4338CA] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] focus:bg-[#3730A3] disabled:text-[#A3A3A3] disabled:bg-[#F5F5F5] hover:bg-[#3730A3] rounded'>Select image</button>
        </div>
      </UploadModal>
    </div>
  );
}

export default App;
