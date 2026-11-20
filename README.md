# ADHD Clinician Locator

An interactive map for finding ADHD clinicians in Southern California by service, population served, and city. 

### Features

- Map with clustered pins
- Filter dropdowns (by service, population served, and city)
- Clinician List

### Tech Stack

- React
- TypeScript
- CesiumJS (Google 2D Imagery via Cesium ion)
- Material UI
- Vite

### Setup Instructions

**Prerequisites:** Node.js and a [Cesium ion](https://ion.cesium.com) access token

```
npm install
cp .env.example .env.local
```

Open `.env.local` and set your token:

```
VITE_CESIUM_ION_TOKEN=your_token_here
```

Then start the dev server:

```
npm run dev
```

### Data Source

Clinician data is a combination of sample data and data from [CHADD](https://chadd.org/professional-directory/?dir_name=&dir_contact=&city=Los+Angeles&state=832&organization_type=&profession=&children=733&adolescents=734&current_page=0)

### Project Structure

- **Components:** map setup, clinician list, clinician cards, and filters
- **Types:** interfaces, helper functions, and types
- **Data:** JSON file of all clinicians