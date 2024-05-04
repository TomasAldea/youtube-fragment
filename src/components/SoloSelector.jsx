import React from "react";
import solos from "../solos.json";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export const SoloSelector = ({ video, setVideo, start, end, end2, player }) => {
  // Función para manejar el cambio de selección
  const handleSelectChange = (value) => {
    const { videoId, videoStart, videoEnd } = JSON.parse(value);
    console.log(videoId);
    setVideo(videoId);
    end(videoEnd);
    end2(videoEnd);
    start(videoStart);
  };

  return (
    <div>
      <Autocomplete
        onSelectionChange={handleSelectChange}
        defaultItems={solos}
        label="Selecciona una canción"
        placeholder="Busca un solo!"
        className="max-w-xs"
      >
        {(solo) => (
          <AutocompleteItem
            key={JSON.stringify(solo)}
          >{`${solo.song} - ${solo.band}`}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};
