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
        return `color: green;`;
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
  border-image-source: linear-gradient(90deg, #2B481E 0%, #233A18 100%);
  border-radius: 2px;
  background: #000;
  margin-right: ;
`;

const EndpointSwitchButton = ({ onClick }) => {
  const status = useAtomValue(rpcApiStatusAtom);

  console.log("------status ConnectStatusDot------")
  console.log(status)

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