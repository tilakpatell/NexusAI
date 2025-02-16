// Home/VideoBackground.jsx
import ReactPlayer from 'react-player';

export function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <ReactPlayer
        url="/videos/robot.mov"
        playing
        playsinline
        loop
        muted
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        config={{
          file: {
            attributes: {
              style: {
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }
            }
          }
        }}
        onReady={() => console.log('Video is ready')}
        onError={(e) => console.log('Video error:', e)}
      />
    </div>
  );
}
