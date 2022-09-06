import axios from 'axios';
import { UploadFileObject, VideoObject } from '../../components/ProjectDetails';
import { awsVideosAPI, awsMultiUploadAPI } from '../../constants/awsLinks';

//GET VIDEOS BY PROJECTID
export const dynamoDBGetVideosByProjectId = async (projectId: string) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  try {
    const response = await axios.get(
      `https://${awsVideosAPI}/videos/${projectId}`,
      config
    );
    return response;
  } catch (error) {
    throw new Error('Could not get videos by Project Id');
  }
};

//DELETE VIDEO BY VIDEO ID
export const s3RemoveVideoById = async (video: VideoObject) => {
  const { id, s3Url } = video;
  try {
    const response = await axios.delete(`https://${awsVideosAPI}/video/${id}`, {
      data: { s3Url },
    });
    console.log('response: ', response);
  } catch (error) {
    throw new Error('Could not remove video by Id');
  }
};

//Upload Multipart
export const startMultiUpload = async (upload: UploadFileObject) => {
  console.log('upload: ', upload);
  const { fileName, projectId, key } = upload;

  const params = {
    fileName,
    projectId,
    key,
  };

  try {
    //start upload API is called here, the route returns multipart upload ID
    const result = await axios.get(
      `https://${awsMultiUploadAPI}/start-upload`,
      {
        params,
      }
    );
    const { UploadId } = result.data.message.result;
    console.log('upload ID: ', UploadId);
    return UploadId;
  } catch (err) {
    console.log('err: ', err);
  }
};

export const uploadMultipartFile = async (
  upload: UploadFileObject,
  uploadId: string,
  abortUpload: boolean,
  setProgressArray: React.Dispatch<React.SetStateAction<number[]>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const fileSize = upload.file.size;
  const { fileName, key } = upload;

  const fileBlob = new Blob([upload.file], { type: 'video/mp4' });

  const controller = new AbortController();

  try {
    const CHUNK_SIZE = 10000000; // 10MB
    const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
    const promisesArray = [];
    let start;
    let end;
    let blob;
    for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
      start = (index - 1) * CHUNK_SIZE;
      end = index * CHUNK_SIZE;
      blob =
        index < CHUNKS_COUNT
          ? fileBlob.slice(start, end)
          : fileBlob.slice(start);

      //Get presigned URL for each part
      const getUploadUrlResponse = await axios.get(
        `https://${awsMultiUploadAPI}/get-upload-url`,
        {
          params: {
            fileName,
            partNumber: index,
            uploadId,
            key,
          },
        }
      );

      const uploadProgressHandler = async (
        progressEvent: any,
        chunks: number,
        index: number
      ) => {
        if (progressEvent.loaded >= progressEvent.total) return;

        const currentProgress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        setProgressArray((progressArray) => {
          progressArray[index - 1] = currentProgress;
          const sum = progressArray.reduce(
            (acc: number, curr: number) => acc + curr
          );
          setUploadProgress(Math.round(sum / chunks));

          return progressArray;
        });
      };

      const presignedUrl = getUploadUrlResponse.data;
      console.log(
        `Presigned URL ${index}: ${presignedUrl} filetype ${fileBlob.type}`
      );

      // Send part to aws server
      const uploadResponse = axios.put(presignedUrl, blob, {
        onUploadProgress: (e) => uploadProgressHandler(e, CHUNKS_COUNT, index),
        headers: {
          'Content-Type': fileBlob.type,
        },
        signal: controller.signal,
      });
      promisesArray.push(uploadResponse);
    }

    if (abortUpload) controller.abort();

    const resolvedArray = await Promise.all(promisesArray);
    console.log('resolvedArray: ', resolvedArray);

    const uploadPartsArray: any[] = [];
    resolvedArray.forEach((resolvedPromise, index) => {
      uploadPartsArray.push({
        ETag: resolvedPromise.headers.etag,
        PartNumber: index + 1,
      });
    });

    console.log('uploadPartsArray: ', uploadPartsArray);

    // CompleteMultipartUpload in the backend server
    const completeUploadResponse = await axios.post(
      `https://${awsMultiUploadAPI}/complete-upload`,
      {
        fileName,
        parts: uploadPartsArray,
        uploadId,
        key,
      }
    );

    console.log('completeUploadResponse: ', completeUploadResponse);
    setUploadProgress(100);
    //   // setUploadSuccess(1)
    //   // // setSubmitSuccess(2)
    //   // setSubmitStatus(oldArray => [...oldArray, fileattach])
    //   // // put a delay in here for 2 seconds
    //   // // also clear down uploadProgress
    //   // console.log(completeUploadResp.data, 'upload response complete ')
  } catch (err) {
    console.log(err);
  }
};

export const abortMultipartUpload = async (
  upload: UploadFileObject,
  uploadId: string
) => {
  const { key } = upload;

  const data = {
    key,
    uploadId,
  };

  console.log('abort about to be called: ', data);
  const abortResult = await axios.delete(
    `https://${awsMultiUploadAPI}/abort-upload`,
    { data }
  );

  return abortResult;
};

//LEGACY UPLOAD CODE
//GET PRESIGNEDURL
// export const s3GetPresignedUrl = async (upload: UploadFileObject) => {
//   const config = {
//     headers: {
//       'content-type': 'application/json',
//     },
//   };
//   const body = {
//     upload,
//   };

//   try {
//     const data = await axios.post(
//       `https://${awsVideosAPI}/videos/${upload.projectId}`,
//       body,
//       config
//     );

//     return data.data;
//   } catch (error) {
//     throw new Error('Could not obtain presignedUrl');
//   }
// };

//UPLOAD VIDEOS
// export const s3UploadVideo = async (
//   url: string,
//   upload: UploadFileObject
// ): Promise<any> => {
//   const config = {
//     headers: {
//       'Content-Type': 'video/mp4',
//       'x-amz-acl': 'public-read',
//     },
//   };
//   const body = {
//     upload,
//   };
//   console.log('body.upload.file: ', body.upload.file);

//   try {
//     const data = await axios.put(url, body.upload.file, config);
//     console.log('upload response data: ', data);
//     return data;
//   } catch (error) {
//     throw new Error('Could not upload videos');
//   }
// };
