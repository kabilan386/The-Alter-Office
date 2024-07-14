import { useRef, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import UploadModal from './components/uploadModal';
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
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
  const openUploadModal = () => setUploadModalVisible(true);
  const closeUploadModal = () => setUploadModalVisible(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFiles(files)
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
  const displayImage = (file: File) => {
    const fileUrl  = URL.createObjectURL(file)
    return fileUrl
  }
  const removeFile = (index : number) => {
    setFiles((preFile) => preFile.filter((_,i) => i !== index))
  }
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setFiles(files);
  };
  console.log("file", files)
  return (
    <div className="bg-custom-gradient flex justify-center  items-center w-full h-screen">
      <div className='bg-white relative rounded-lg border overflow-hidden border-1 w-[90%] md:w-[70%] h-[420px]  mx-[10px]  md:mx-[20px] lg:mx-[20%]'>
        <div className=' bg-custom-image h-[176px] w-full bg-cover bg-right-center'>
        </div>
        <div onClick={openModal} className='cursor-pointer absolute borde top-[130px] md:top-[100px] left-[10px] md:left-[20px] w-[96px] h-[96px] md:w-[160px] md:h-[160px]'>
          <img alt='profile' className='bg-slate-400 border border-[6px] border-white rounded-full' src='./assets/img/Vector.png' />
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
      <Modal isVisible={isModalVisible} onClose={closeModal}>
        <ReactCrop circularCrop crop={crop} onChange={c => setCrop(c)}>
          <img alt='crop' ref={imgRef} className=' py-[10px] bg-black' src='./assets/img/Vector.png' />
        </ReactCrop>
        <div className='flex mt-3 gap-5 items-center justify-between'>
          <button className='shadow w-full py-[10px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded' onClick={closeModal}>Cancel</button>
          <button className='shadow w-full py-[10px] text-white bg-[#4338CA] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Confirm</button>
        </div>
      </Modal>
      <UploadModal isVisible={isUploadModalVisible} onClose={closeUploadModal}>
        <div onDrop={handleDrop} onDragOver={handleDragOver} className='relative my-3' id="drop-area">
          <input className='hidden'
            type="file"
            id="fileElem"
            multiple
            onChange={handleFileInputChange}
          />
          {files.length < 6 ? <label className="p-[10px] cursor-pointer rounded-md h-[192px] flex items-center justify-center border border-1 border-[#E5E5E5] bg-[#FAFAFA]" htmlFor="fileElem">
            <div className='flex flex-col justify-center items-center'>
              <img alt='upload-file' className='w-[48px] h-[48px] ' src='./assets/img/upload-icon.png' />
              <div className="text-[13px] md:text-[18px] lg:text-[14px] text-[#171717] leading-7">Click or drag and drop to upload</div>
              <div className="text-[#525252] text-[14px]">PNG, or JPG (Max 5MB)</div>
            </div>
          </label> : 
            <div className='flex flex-col justify-center items-center'>
            <div className="text-[13px] md:text-[18px] lg:text-[14px] text-[#DC2626] leading-7">You've reached the image limit</div>
            <div className="text-[#525252] text-[14px]">Remove one or more to upload more images.</div>
          </div>
          }
        </div>
        <div>
          {files.length > 0 && files.map((file, index) => <div key={index} className='my-2 flex justify-between items-start'>
            <div className='flex gap-5'>
              <img alt='user-image' className='w-[80px] h-[80px]' src={displayImage(file)} />
              <div className='flex flex-col justify-between'>
                <div>
                  <div className='font-semibold text-[#171717] text-[13px] md:text-[16px] leading-7'>{file?.name}</div>
                  <div className='text-[#525252] text-[12px]'>{displayFileSize(file)}</div>
                </div>
                <div className='flex gap-2 xl:gap-6 justify-start items-center'>
                  <button className='text-[10px] md:text-[14px] text-[#525252] flex gap-1 md:gap-4 lg:gap-1 xl:gap-6 leading-5 justify-center items-center'>
                    <img alt="crop-area" className='w-[8px] h-[8px] md:w-[13px] md:h-[13px]' src='./assets/img/crop.png' />
                    Crop Image
                  </button>
                  <button onClick={() => removeFile(index)} className='text-[10px] md:text-[14px] text-[#525252] flex gap-1 md:gap-4 lg:gap-1 xl:gap-6 justify-center items-center'>
                    <img alt='delete' className='w-[8px] h-[8px] md:w-[13px] md:h-[13px]' src='./assets/img/delete.png' />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div>
              <input name='profile' className='hover:border-[#4F46E5] accent-[#4338CA] w-[16px] h-[16px]' type='radio' />
            </div>
          </div>)}
        </div>
        <div className='flex mt-3 gap-5 items-center justify-between'>
          <button className='shadow w-full py-[10px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Cancel</button>
          <button className='shadow w-full py-[10px] text-white bg-[#4338CA] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] focus:bg-[#3730A3] disabled:text-[#A3A3A3] disabled:bg-[#F5F5F5] hover:bg-[#3730A3] rounded'>Select image</button>
        </div>
      </UploadModal>
    </div>
  );
}

export default App;
