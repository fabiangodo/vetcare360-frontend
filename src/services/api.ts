// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

// Token real de Cognito extraído de AWS CLI (IdToken válido)
const COGNITO_ID_TOKEN = 'eyJraWQiOiI0Y01YTmtYYjZrTzVRSnRsNndkZ1dLR1ZKK2NHQU5IVG1WMVdGc2dHaXBNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NDk4ODQ0OC1mMDkxLTcwYTItNTgwYS00NGE5YzczNTQyMTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS91cy1lYXN0LTFfZHNVaXN1Ujc3IiwiY29nbml0bzp1c2VybmFtZSI6Ijg0OTg4NDQ4LWYwOTEtNzBhMi01ODBhLTQ0YTljNzM1NDIxMyIsIm9yaWdpbl9qdGkiOiI2ZWY2ZTJhYS01MmI0LTRkMmYtYmIxNS0zNDdiYjQzNjFlMmEiLCJhdWQiOiI3Y3A5ZDVnMGxxc3F0b2wzdW5qc241b3U2MSIsImV2ZW50X2lkIjoiMmQzZDFhMWUtODNkNy00ZDdhLWJjN2YtMDMzYWFmMGVmMzk2IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3OTMxNjAzMDQsImV4cCI6MTc5MzE2MzkwNCwiaWF0IjoxNzkzMTYwMzA1LCJqdGkiOiI2YTZjYWFjNS0yYTdiLTRiODMtODk0Ni1lMDdlYTljNmZmNjMiLCJlbWFpbCI6ImVkaXRvckB0ZXN0LmNvbSJ9.p4YZHapeTIBSEN6tVNNBEhRY5yzaGFG9CDYY1fjpUezNeVJ4TTSTLtb6PVx31CkRILoHa9OiZ3Pmr8E44y-AuB22UvGjxSqW5WHZoJ1FT0m3XsU8R02U1TChIEpaNS6fYLGAoyRPbSOSMe73joCWWT2P-OjmTfrV2H5kBQzDeMP75YTnQMdPEjtd-EN1OkvCVmbMuYDLwTjFKYuuYqavb8g0qhSjRaEmGekmTV9aVhGUxZRejew6XZd2yf-gRvkcZme8uYfW9WHTwewtZT40FEtttrj6xfgg7Y7U4LtN-ke7ku0djVK_RsjRq4sskFehikEsOn2X1_q4zvOpRDY19g';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // Prioriza un token guardado en localStorage o utiliza el token real asignado
  const token = localStorage.getItem('idToken') || COGNITO_ID_TOKEN;

  const response = await fetch(AWS_API_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...datosMascota,
      timestamp: new Date().toISOString(),
      origen: 'FRONTEND_REACT'
    }),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};