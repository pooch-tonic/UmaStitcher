import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Image from "./Image";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";

const GridItem = ({ image, index, active, fade, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: fade ? 0.5 : 1,
  };

  return (
    <Grid
      xs={6}
      sm={4}
      md={3}
      id={props.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Image src={image.content} alt={`Thumbnail of image ${index + 1}`} />
    </Grid>
  );
};

const ImageGrid = ({ images, updateImages }) => {
  const [activeId, setActiveId] = React.useState(null);
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((e) => e.id === active.id);
      const newIndex = images.findIndex((e) => e.id === over.id);
      updateImages(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
  };

  const disableSortingStrategy = () => {
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragEnd}
    >
      <Grid container spacing={{ xs: 1, md: 2 }}>
        <SortableContext items={images} strategy={disableSortingStrategy}>
          {images.map((image, index) => (
            <GridItem
              id={image.id}
              key={image.id}
              image={image}
              index={index}
              active={activeId === image.id}
              fade={activeId && activeId !== image.id}
            />
          ))}
        </SortableContext>
      </Grid>
    </DndContext>
  );
};

export default ImageGrid;
