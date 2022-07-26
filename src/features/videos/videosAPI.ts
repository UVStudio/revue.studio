import axios from 'axios';
import { UploadFileObject, VideoObject } from '../../components/ProjectDetails';
import { awsVideosAPI, awsMultiUploadAPI } from '../../constants/awsLinks';
import { convertFileName } from '../../utils/filenameClean';

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

//GET VIDEO BY VIDEO ID
export const dynamoDBGetVideoByVideoId = async (videoId: string) => {
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  try {
    const response = await axios.get(
      `https://${awsVideosAPI}/video/${videoId}`,
      config
    );
    return response;
  } catch (error) {
    throw new Error('Could not get video by Video Id');
  }
};

export const s3DownloadVideoById = async (video: VideoObject) => {
  const { id, s3Url } = video;
  const serverFileName = s3Url.split('/')[s3Url.split('/').length - 1];
  const userFileName = convertFileName(serverFileName);
  console.log(userFileName);
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

//GET ALL VIDEOS FROM DDB BY USER ID
//For the purpose of calculating total storage
export const getS3AllVideosByUserId = async (userId: string) => {
  try {
    const response = await axios.get(
      `https://${awsVideosAPI}/videos/user/${userId}`
    );
    return response;
  } catch (error) {
    throw new Error('Could not get videos by user Id');
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
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>
) => {
  const fileSize = upload.file.size;
  const { fileName, key } = upload;

  const fileBlob = new Blob([upload.file], { type: 'video/mp4' });

  const controller = new AbortController();

  try {
    const CHUNK_SIZE = 10000000; // 10MB
    const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
    const promisesArray = [];
    let start: number;
    let end: number;
    let blob: Blob;
    const estArray: any[] = [];
    const latestArray: number[] = [];
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
          const progressOverChunks = sum / chunks;
          setUploadProgress(Math.round(progressOverChunks));

          estArray.push({ progress: progressOverChunks, time: Date.now() });

          const dynamicLength = estArray.length;
          if (dynamicLength > 9) {
            const dynamicPercent =
              estArray[dynamicLength - 1].progress -
              estArray[dynamicLength - 9].progress;

            const dynamicTimeDiff =
              estArray[dynamicLength - 1].time -
              estArray[dynamicLength - 9].time;

            const remainder = 100 - progressOverChunks;

            //eg dynamicPercent is 2%, dynamicDiff is 1000 milli
            //if remainder is 50%, then we need 50/2*1000 = 25000 millis to complete upload
            //if remainder is 80%, then we need 80/2*1000 = 40000 millis to complete upload
            const milliRemaining =
              (remainder / dynamicPercent) * dynamicTimeDiff;

            latestArray.push(milliRemaining);

            if (progressOverChunks > 0 && latestArray.length <= 30) {
              //first 30 data points from axios get printed onto the UI directly...
              setTimeRemaining(milliRemaining);
              //after that, the average of the last 30 is printed...
            } else if (latestArray.length > 30) {
              let sumTotal = 0;
              for (let i = 1; i < 31; i++) {
                sumTotal = sumTotal + latestArray[latestArray.length - i];
                let lastThirtyAverage = sumTotal / 30;
                //if almost done, revert back to milliRemaining to make sure we hit 0
                if (latestArray[latestArray.length - i] < 4000) {
                  lastThirtyAverage = milliRemaining;
                }
                if (milliRemaining < 200) {
                  lastThirtyAverage = 0;
                }
                setTimeRemaining(lastThirtyAverage);
              }
            }
          }
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
