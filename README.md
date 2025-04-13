## Overview

**milrem** is an Unmanned Ground Vehicle (UGV) control application built with Vue.js, Leaflet, and Pinia. It enables users to start/stop the UGV engine, control the UGV's movement via keyboard arrow keys, and manage waypoints on an interactive map. Users can add new waypoints via a long press on the map and choose to drive to a waypoint, save it, or discard it. Saved waypoints can later be edited with options to delete, rename, or drive to them.

## Features

- **Engine Control:** Toggle the UGV engine on/off using a dedicated button in the top right.
- **Movement Control:** Use keyboard arrow keys to move the UGV (movement is disabled when the engine is off).
- **Dynamic Waypoints:**
    - **New Waypoint Popup:** After a 2-second long press on the map, a popup appears with options to Drive, Save, or Discard the new waypoint.
    - **Saved Waypoint Management:** Saved waypoints appear in a column at the bottom left and offer options to Delete, Rename, or Drive to the waypoint.
- **Map Interaction:** The map uses Leaflet with dynamic fitBounds to adjust the view when adding new waypoints.

## Installation

Make sure you have Node.js installed on your system. Then, clone the repository and install the dependencies:

```npm install```

Running the Application
run the following command:

```npm run dev```

The application will be available in your browser at http://localhost:5173.

### Usage
Engine Control:
Click the engine button (top-right) to start/stop the UGV engine. The UGV will remain stationary unless the engine is on.

## Movement:
Use the keyboard's arrow keys to move the UGV on the map once the engine is started.

## Adding Waypoints:
Long press (2 seconds) on the map to create a new waypoint. This will trigger a popup with the following options:

- Drive: Immediately moves the UGV to the waypoint's coordinates.
- Save: Saves the waypoint to the list (displayed at the bottom left).
- Discard: Cancels the waypoint creation and removes its marker from the map.

## Managing Saved Waypoints:
Saved waypoints are listed at the bottom left of the screen. Click on a waypoint to edit it (options include Delete, Rename, and Drive).

## Challenges
The most time-consuming and challenging part of the assignment was managing the waypoint behavior on the map. The waypoints occasionally do not remain perfectly anchored during zoom operations; in some cases, they tend to shift position unexpectedly. This remains an area for further refinement.

## AI Assistance
I used AI systems to generate the project structure, implement basic Leaflet plugins integration, and assist in refactoring code to improve functionality and organization. AI also contributed to drafting documentation and guiding development decisions throughout the project.

## Video
<video width="640" height="360" controls>
  <source src="src/assets/milrem_video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
