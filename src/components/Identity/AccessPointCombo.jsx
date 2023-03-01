import { Button, ButtonGroup } from "@chakra-ui/react";
import { Suspense } from "react";
import { Box } from "@chakra-ui/react";
import { GoPrimitiveDot } from "react-icons/go";
import styled from "@emotion/styled";
import { useAtomValue } from 'jotai'

import { rpcApiStatusAtom } from '../Atoms/FoundationBase'

const ConnectStatusDot = styled(GoPrimitiveDot)`
  ${({ connected }) => {
    switch (connected) {
      case 'connected':
        return `color: #C5FF47;`;
      case 'connecting':
        return `color: orange;`;
      case 'error':
        return `color: red;`;
      default:
        return `color: gray;`;
    }
  }}
`;

const StyledButtonGroup = styled.div`
  border-image-slice: 1;
  border-width: 1px;
  border-image-source: linear-gradient(90deg, #C5FF47 0%, #C5FF47 100%);
  border-radius: 2px;
  background: #000;
  margin-right: 10px;
`;

const EndpointSwitchButton = ({ onClick }) => {
  const status = useAtomValue(rpcApiStatusAtom);

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
          <ConnectStatusDot connected={status} />
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