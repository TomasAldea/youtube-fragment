import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Checkbox } from "@nextui-org/react";
import { Slider } from "@nextui-org/react";

export const GuitarPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [startMarker, setStartMarker] = useState(0);
  const [endMarker, setEndMarker] = useState(0);
  // Este es para el tiempo, no para el label
  const [endMarkerTime, setEndMarkerTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [videoId, setVideoId] = useState("xMV6l2y67rk"); // Video por defecto
  const [videoUrl, setVideoUrl] = useState("");
  const [claqueta, setClaqueta] = useState(true); // Estado para activar/desactivar audioRef
  const audioRef = useRef(); // Ref para el elemento de audio
  const lastChangeTimestamp = useRef(null);

  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then((clipboardText) => {
      setVideoUrl(clipboardText);
    });
  };

  const onReady = (event) => {
    setPlayer(event.target);
    const duration = event.target.getDuration();
    setTotalTime(duration);
  };

  const func = () => {};

  const onPlay = () => {
    if (startMarker >= endMarkerTime) {
      return;
    }
    stopClaqueta();
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime()?.toFixed();

      if (currentTime == endMarkerTime) {
        clearInterval(interval);
        player.pauseVideo();

        claqueta && playClaqueta();
        var timeOut = claqueta ? 4500 : 0;
        setTimeout(() => {
          player.playVideo();
          player.seekTo(startMarker);
        }, timeOut);
      }
    }, 1000);

    // Limpia el intervalo cuando se detiene la reproducción
    const onPause = () => clearInterval(interval);
    player.addEventListener("onPause", onPause);

    // Limpia el intervalo al destruir el componente
    return () => {
      clearInterval(interval);
      player.removeEventListener("onPause", onPause);
    };
  };

  const playClaqueta = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const stopClaqueta = () => {
    audioRef.current.pause();
  };

  const handleStartMarkerChange = (value) => {
    console.log(value);
    player.pauseVideo();
    stopClaqueta();
    if (endMarkerTime < startMarker) {
      setEndMarkerTime(value);
      setEndMarker(value);
    }
    setStartMarker(value);

    player.seekTo(value);
  };

  const handleEndMarkerChange = (value) => {
    // Almacenar la marca de tiempo actual
    lastChangeTimestamp.current = Date.now();

    setTimeout(() => {
      if (Date.now() - lastChangeTimestamp.current >= 1000) {
        setEndMarkerTime(value);
      }
    }, 1000);
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
    if (player && startMarker && endMarkerTime) {
      player.loadVideoById(videoId, startMarker);
      /* stopClaqueta(); */
    }
  }, [endMarkerTime, videoId, startMarker]);

  return (
    <div
      id="player-container"
      className="max-w-screen-md mx-auto mb-8 mt-8 p-4 rounded-md"
    >
      <audio ref={audioRef} src="metronome.mp3" />{" "}
      {/* Agrega la ruta del archivo de audio */}
      <div className="mb-4">
        <div className="flex flex-row">
          <label className="text-sm font-semibold mr-2 mb-4">
            URL del Video
          </label>
          <img
            onClick={pasteFromClipboard}
            className=" cursor-pointer w-5 h-5"
            src="/images/paste.png"
            alt="paste"
          />
        </div>

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
        onPause={func}
        onPlay={onPlay}
        opts={{ playerVars: { controls: 1 } }}
      />
      <div className="mb-4 mt-4 flex flex-row items-center">
        <Checkbox
          checked={claqueta}
          defaultSelected
          onChange={() => setClaqueta(!claqueta)}
        >
          Activar Claqueta
        </Checkbox>
      </div>
      <div className="flex justify-start items-center mt-4 mb-6">
        <div className="relative w-3/4 flex flex-row items-center">
          <Slider
            label="Inicio"
            size="sm"
            step="1"
            maxValue={totalTime}
            getValue={(time) => `${formatTime(time)}`}
            className="max-w-md"
            value={startMarker}
            onChange={(val) => handleStartMarkerChange(val)}
          />
        </div>
      </div>
      <div className="flex justify-start items-center mt-4">
        <div className="relative w-3/4 flex flex-row items-center">
          
          <Slider
            label="Fin"
            size="sm"
            step="1"
            maxValue={totalTime}
            getValue={(time) => `${formatTime(time)}`}
            className="max-w-md"
            value={endMarker}
            onChange={(val) => {
              setEndMarker(val);
              handleEndMarkerChange(val);
            }}
          />
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
