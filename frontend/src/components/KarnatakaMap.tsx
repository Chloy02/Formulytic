import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapImage = styled(Image)`
  aspect-ratio: 16 / 9;
  max-width: 400px;
  filter: drop-shadow(0 10px 25px rgba(0, 123, 255, 0.15));
  
  @media (max-width: 768px) {
    max-width: 300px;
    filter: none;
  }
`;

const KarnatakaMap: React.FC = () => {
  return (
    <MapContainer>
      <MapImage
        src="/images/Karnataka_districts_map.svg"
        alt="Karnataka Map showing survey coverage across districts"
        width={400}
        height={450}
        priority
      />
    </MapContainer>
  );
};

export default KarnatakaMap;
