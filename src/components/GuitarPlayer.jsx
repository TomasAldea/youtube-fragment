import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

export const GuitarPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [startMarker, setStartMarker] = useState(0);
  const [endMarker, setEndMarker] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [videoId, setVideoId] = useState("PvF9PAxe5Ng"); // Video por defecto
  const [videoUrl, setVideoUrl] = useState("");
  const audioRef = React.createRef(); // Ref para el elemento de audio
  const [claqueta, setClaqueta] = useState(true); // Estado para activar/desactivar audioRef

  const onReady = (event) => {
    setPlayer(event.target);
    const duration = event.target.getDuration();
    setTotalTime(duration);
  };

  const onPlay = () => {
    if (startMarker >= endMarker) {
      return;
    }

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime().toFixed();

      if (currentTime >= endMarker) {
        clearInterval(interval);
        player.pauseVideo();

        claqueta && playAudioEverySecond();

        var timeOut = claqueta ? 5000 : 0;
        setTimeout(() => {
          player.playVideo();
          player.seekTo(startMarker);
        }, timeOut);
      }
    }, 1000); // Comprueba cada segundo

    // Limpia el intervalo cuando se detiene la reproducción
    const onPause = () => clearInterval(interval);
    player.addEventListener("onPause", onPause);

    // Limpia el intervalo al destruir el componente
    return () => {
      clearInterval(interval);
      player.removeEventListener("onPause", onPause);
    };
  };

  const playAudioEverySecond = () => {
    console.log("hola");
    let intervalId;

    intervalId = setInterval(() => {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }, 1000);

    // Detener el intervalo después de 4 segundos
    setTimeout(() => {
      clearInterval(intervalId);
    }, 4000);
  };

  const handleMarkerChange = (markerType, value) => {
    if (markerType === "start") {
      setStartMarker(value);
    } else {
      setEndMarker(value);
    }
  };

  const handleVideoUrlChange = () => {
    // Extraer el ID del video desde la URL
    const videoIdFromUrl = extractVideoIdFromUrl(videoUrl);
    if (videoIdFromUrl) {
      setVideoId(videoIdFromUrl);
    }
  };

  const extractVideoIdFromUrl = (url) => {
    // Manejar tanto el formato de escritorio como el de móvil
    const desktopMatch = url.match(/[?&]v=([^#\&\?]*).*/);
    const mobileMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    // Retornar la coincidencia que no sea null
    return desktopMatch && desktopMatch[1]
      ? desktopMatch[1]
      : mobileMatch && mobileMatch[1]
      ? mobileMatch[1]
      : null;
  };

  // Reinicia el video cuando cambian los marcadores o la URL
  useEffect(() => {
    if (player && startMarker && endMarker) {
      player.loadVideoById(videoId, startMarker);
    }
  }, [startMarker, endMarker, videoId, claqueta]);

  return (
    <div className="max-w-screen-md mx-auto my-8 p-4 bg-white shadow-md rounded-md">
      <audio ref={audioRef} src="metronome.mp3" />{" "}
      {/* Agrega la ruta del archivo de audio */}
      <div className="mb-4">
        <label className="text-sm font-semibold">URL del Video:</label>
        <input
          className="w-full border rounded px-2 py-1"
          type="text"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            /* handleVideoUrlChange(e.target.value); */
          }}
        />
      </div>
      <button
        className="mb-2 bg-blue-500 text-white px-4 py-1 rounded"
        onClick={handleVideoUrlChange}
      >
        Cambiar Video
      </button>
      <YouTube
        className="w-full"
        iframeClassName="w-full"
        videoId={videoId}
        onReady={onReady}
        onPlay={onPlay}
        opts={{ playerVars: { controls: 1 } }}
      />
      <div className="mb-4 mt-8 flex flex-row items-center">
        <label className="text-sm font-semibold mr-2">Activar Claqueta:</label>
        <input
          type="checkbox"
          checked={claqueta}
          onChange={() => setClaqueta(!claqueta)}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className="text-sm font-semibold">Inicio:</label>
        <div className="relative w-3/4">
          <input
            className="w-full"
            type="range"
            min="0"
            max={totalTime}
            step="1"
            value={startMarker}
            onChange={(e) =>
              handleMarkerChange("start", parseInt(e.target.value, 10))
            }
          />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-6 text-xs font-semibold">
            {formatTime(startMarker)}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className="text-sm font-semibold">Fin:</label>
        <div className="relative w-3/4">
          <input
            className="w-full"
            type="range"
            min="0"
            max={totalTime}
            step="1"
            value={endMarker}
            onChange={(e) =>
              handleMarkerChange("end", parseInt(e.target.value, 10))
            }
          />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-6 text-xs font-semibold">
            {formatTime(endMarker)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Función para formatear el tiempo en minutos y segundos
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.round(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
