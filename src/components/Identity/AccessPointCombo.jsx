import { Button, ButtonGroup } from "@chakra-ui/react";
import { Suspense } from "react";
import { Box } from "@chakra-ui/react";
import { GoPrimitiveDot } from "react-icons/go";
import styled from "@emotion/styled";



const ConnectStatusDot = styled(GoPrimitiveDot)`
  ${({ connected }) => !!connected ? `color: green;` : `color: gray;`}
`;

const StyledButtonGroup = styled.div`
  border-image-slice: 1;
  border-width: 1px;
  border-image-source: linear-gradient(90deg, #2B481E 0%, #233A18 100%);
  border-radius: 2px;
  background: #000;
  margin-right: ;
`;

const EndpointSwitchButton = ({ onClick }) => {
  return (
    <Button
      variant="unstyled"
      display="flex"
      alignItems="center"
      onClick={onClick}
    >
      <Suspense
        fallback={
          <>
            <ConnectStatusDot />
          </>
        }
      >
        <Box w="4" h="4">
          <ConnectStatusDot connected="1" />
        </Box>
      </Suspense>
    </Button>
  );
}

export default function AccessPointCombo({ onConnectionStatusClick }) {
  return (
    <ButtonGroup as={StyledButtonGroup}>
      <EndpointSwitchButton onClick={onConnectionStatusClick} />
    </ButtonGroup>
  )
}