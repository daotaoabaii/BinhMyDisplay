import React, { useState, useCallback, useEffect } from 'react';
import type { MongoImage } from './types';
import { ResultDisplay } from './components/ResultDisplay';
import { FullscreenViewer } from './components/FullscreenViewer';
import { LogoIcon } from './components/icons';
import { getLatestImages } from './services/mongoService';

function App() {
  const [images, setImages] = useState<MongoImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<MongoImage | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // Fetch latest images from MongoDB on component mount and periodically
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const latestImages = await getLatestImages(20);
        setImages(latestImages);
        
        // Auto-open first image in fullscreen
        if (latestImages.length > 0 && !selectedImage) {
          setSelectedImage(latestImages[0]);
          setIsViewerOpen(true);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn.";
        console.error("Failed to fetch images:", errorMessage);
        setError(`Không thể tải ảnh: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();

    // Refresh images every 5 seconds (but don't change the viewer if it's open)
    const interval = setInterval(fetchImages, 5000);
    return () => clearInterval(interval);
  }, [selectedImage]);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  }, []);

  const handleImageClick = useCallback((image: MongoImage) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  }, []);

  return (
    <>
      {/* Only show UI when not in fullscreen viewer mode */}
      {!isViewerOpen && (
        <div className="min-h-screen bg-brand-bg font-sans p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-8">
              <div className="flex items-center justify-center gap-4">
                <LogoIcon className="h-12 w-12" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-primary-dark">
                  Trình Hiển Thị Ảnh
                </h1>
              </div>
            </header>

            <main className="grid grid-cols-1 gap-8 min-h-[70vh]">
              <div className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-fade-in" role="alert">
                    <strong className="font-bold">Lỗi: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div className="flex-grow">
                  <ResultDisplay 
                    images={images}
                    isLoading={isLoading} 
                    onImageClick={handleImageClick}
                  />
                </div>
              </div>
            </main>
            
            <footer className="text-center mt-8 text-sm text-brand-muted">
              <p>Phát triển bởi Bộ phận Đào tạo - Viện Công nghệ Blockchain và Trí tuệ nhân tạo ABAII</p>
            </footer>
          </div>
        </div>
      )}
      
      {/* Fullscreen viewer */}
      {isViewerOpen && selectedImage && (
        <FullscreenViewer
          image={selectedImage}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
}

export default App;
