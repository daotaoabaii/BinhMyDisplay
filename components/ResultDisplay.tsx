import React from 'react';
import type { MongoImage } from '../types';
import Spinner from './Spinner';

interface ResultDisplayProps {
  images: MongoImage[];
  isLoading: boolean;
  onImageClick: (image: MongoImage) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, isLoading, onImageClick }) => {
  if (isLoading) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg p-8 animate-fade-in shadow-sm border border-brand-border"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner />
        <p className="mt-4 text-lg text-brand-muted">Đang tải ảnh...</p>
        <p className="text-sm text-brand-muted">Vui lòng chờ.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg p-8 text-center shadow-sm border border-brand-border" aria-live="polite">
        <h3 className="text-2xl font-bold text-brand-primary-dark">Chưa có ảnh nào</h3>
        <p className="mt-2 text-brand-muted">Không tìm thấy ảnh trong cơ sở dữ liệu.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg p-8 shadow-sm border border-brand-border" aria-live="polite">
      <h2 className="text-2xl font-bold text-brand-primary-dark mb-6">Hình Ảnh Mới Nhất ({images.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow overflow-y-auto">
        {images.map((image) => (
          <div 
            key={image._id} 
            className="relative group animate-fade-in rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onImageClick(image)}
          >
            <img 
              src={image.imageBase64 || image.imageUrl || 'https://via.placeholder.com/200'} 
              alt={image.imageName} 
              className="w-full h-48 object-cover hover:opacity-80 transition-opacity" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-brand-primary text-white rounded-full p-3 mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <p className="text-white text-sm font-semibold truncate">{image.imageName}</p>
              <div className="flex items-center mt-1">
                <span className="inline-block bg-brand-primary text-white px-2 py-1 rounded text-xs font-semibold">
                  {image.matchScore}%
                </span>
                {image.source && (
                  <span className="ml-2 text-xs text-gray-300">{image.source}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};