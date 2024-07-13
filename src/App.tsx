import { useRef, useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import UploadModal from './components/uploadModal';
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
function App() {
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
  return (
    <div className="bg-custom-gradient flex justify-center  items-center w-full h-screen">
      <div className='bg-white relative rounded-lg border overflow-hidden border-1 w-[90%] md:w-[70%] h-[420px]  mx-[10px]  md:mx-[20px] lg:mx-[20%]'>
        <div className=' bg-custom-image h-[176px] w-full bg-cover bg-right-center'>
        </div>
        <div onClick={openModal} className='cursor-pointer absolute borde top-[130px] md:top-[100px] left-[10px] md:left-[20px] w-[96px] h-[96px] md:w-[160px] md:h-[160px]'>
          <img className='bg-slate-400 border border-[6px] border-white rounded-full' src='./assets/img/Vector.png' />
        </div>
        <div className=''>
          <div className='flex justify-end items-center'>
            <button onClick={openUploadModal} className='shadow py-[7px] md:py-[10px] px-[7px] md:px-[20px] mt-[5px] md:mt-[15px] mr-[10px] md:mr-[15px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Update picture</button>
          </div>
          <div className='pl-[25px] mt-[15px] md:mt-[30px]'>
            <h2 className='text-[#171717] mb-[18px] text-[20px] md:text-[30px] font-semibold leading-9'>Jack Smith</h2>
            <div className='flex flex-col md:flex-row md:items-center'>
              <p className='font-normal my-1'>@kingjack</p>
              <span className="hidden md:inline-block mx-3 h-[5px] w-[5px] bg-gray-400 rounded-full "></span>
              <p className='my-1'>Senior Product Designer</p>
              <div className='my-1 flex items-center'>
                <p className='ml-0 md:ml-3 mr-3'>at</p>
                <img className='w-[20px] h-[15px] mx-[2px]' src='./assets/img/company-logo.png' />
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
          <img ref={imgRef} className=' py-[10px] bg-black' src='./assets/img/Vector.png' />
        </ReactCrop>
        <div className='flex mt-3 gap-5 items-center justify-between'>
          <button className='shadow w-full py-[10px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Cancel</button>
          <button className='shadow w-full py-[10px] text-white bg-[#4338CA] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Confirm</button>
        </div>
      </Modal>
      <UploadModal isVisible={isUploadModalVisible} onClose={closeUploadModal}>
        <div className='relative my-3' id="drop-area">
          <input className='hidden'
            type="file"
            id="fileElem"
            accept="image/*"
            onChange={e => { }}
          />
          <label className="p-[10px] cursor-pointer rounded-md h-[192px] flex items-center justify-center border border-1 border-[#E5E5E5] bg-[#FAFAFA]" htmlFor="fileElem">
            <div className='flex flex-col justify-center items-center'>
              <img className='w-[48px] h-[48px] ' src='./assets/img/upload-icon.png' />
              <div className="text-[18px] text-[#171717] leading-7">Click or drag and drop to upload</div>
              <div className="text-[#525252] text-[14px]">PNG, or JPG (Max 5MB)</div>
            </div>
          </label>
        </div>
        <div>
          <div className='my-2 flex justify-between items-start'>
            <div className='flex gap-5'>
              <img className='w-[80px] h-[80px]' src='./assets/img/user-1.png' />
              <div className='flex flex-col justify-between'>
                <div>
                  <div className='font-semibold text-[#171717] text-[16px] leading-7'>IMG_0083.jpg</div>
                  <div className='text-[#525252] text-[12px]'>331kb</div>
                </div>
                <div className='flex gap-2 justify-start items-center'>
                  <button className='text-[14px] text-[#525252] flex gap-4 leading-5 justify-center items-center'>
                    <img className='w-[13px] h-[13px]' src='./assets/img/crop.png' />
                    Crop Image
                  </button>
                  <button className='text-[14px] text-[#525252] flex gap-4 justify-center items-center'>
                    <img className='w-[13px] h-[13px]' src='./assets/img/delete.png' />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div>
              <input className='accent-[#4338CA] w-[16px] h-[16px]' type='radio' />
            </div>
          </div>
        </div>
        <div className='flex mt-3 gap-5 items-center justify-between'>
          <button className='shadow w-full py-[10px] text-[#171717] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Cancel</button>
          <button className='shadow w-full py-[10px] text-white bg-[#4338CA] border border-[0.5px] border-[#E5E5E5] text-[14px] md:text-[16px] rounded'>Select image</button>
        </div>
      </UploadModal>
    </div>
  );
}

export default App;
