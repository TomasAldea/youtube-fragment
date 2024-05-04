import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Checkbox } from "@nextui-org/react";
import { Slider, Button } from "@nextui-org/react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { SoloSelector } from "./SoloSelector";

export const GuitarPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [endMarkerTime, setEndMarkerTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [videoId, setVideoId] = useState("xMV6l2y67rk"); // Video por defecto
  const [videoUrl, setVideoUrl] = useState("");
  const [claqueta, setClaqueta] = useState(true); // Estado para activar/desactivar audioRef
  const audioRef = useRef(); // Ref para el elemento de audio
  const playerRef = useRef();

  const [playbackRate, setPlaybackRate] = useState(1);
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
    if (startMarker) {
      event.target.seekTo(startMarker);
      player?.seekTo(startMarker);
    }
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

  const audioSpeed = (speed) => {
    console.log(playerRef.current);
  };

  const playClaqueta = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const stopClaqueta = () => {
    audioRef.current.pause();
  };

  const handleStartMarkerChange = (value) => {
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

    setEndMarkerTime(value);

    if (startMarker >= endMarkerTime) {
      player.seekTo(startMarker);
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

  return (
    <div
      id="player-container"
      className="max-w-[95vw] mx-auto mb-8 mt-8 p-4 rounded-md border-[#E65C19] border-1 dark:bg-[#B51B75] lg:max-w-screen-lg"
    >
      <audio ref={audioRef} src="metronome.mp3" />{" "}
      {/* Agrega la ruta del archivo de audio */}
      <div className="gap-2 flex-col flex justify-start place-items-start mb-4">
        <Button
          onClick={pasteFromClipboard}
          color="primary"
          variant="light"
          className=""
        >
          URL del Video
          <ClipboardIcon className="w-5 h-5 cursor-pointer"></ClipboardIcon>
        </Button>
        <SoloSelector
          video={videoId}
          setVideo={setVideoId}
          start={setStartMarker}
          end={setEndMarker}
          end2={setEndMarkerTime}
          player={player}
        ></SoloSelector>
        <input
          className="w-full border rounded px-2 py-1"
          type="text"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            /* handleVideoUrlChange(e.target.value); */
          }}
        />
        <Button
          className=""
          color="primary"
          variant="ghost"
          onClick={handleVideoUrlChange}
        >
          Cambiar Video
        </Button>
      </div>
      <YouTube
        className="w-full h-72 lg:h-[30vw]"
        iframeClassName="w-full h-full"
        videoId={videoId}
        onReady={onReady}
        onPause={func}
        onPlay={onPlay}
        controls
        ref={playerRef}
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
        <div className="flex justify-start items-center mt-4 mb-6">
          {/*<select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>*/}
        </div>
        <button onClick={() => audioSpeed(0.5)}>x0.5</button>
        <button onClick={() => audioSpeed(1)}>x1</button>
        <button onClick={() => audioSpeed(2)}>x2</button>
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
