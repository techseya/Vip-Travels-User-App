import {Button, Dialog, Portal, Text} from 'react-native-paper';
import colors from 'src/constants/colors';

const CustomPopUp = ({
  visible,
  setVisible,
  action,
  title,
  description,
  icon,
  backgroundColor,
  isCancel,
}) => {
  return (
    <Portal>
      <Dialog
        style={{backgroundColor: backgroundColor}}
        dismissable={false}
        visible={visible}
        onDismiss={setVisible}>
        {icon ? <Dialog.Icon icon={icon} /> : null}
        <Dialog.Title style={{color: colors.DARK}}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={{color: colors.DARK}} variant="bodyMedium">
            {description}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          {isCancel ? (
            <Button onPress={() => setVisible()}>Cancel</Button>
          ) : null}
          <Button
            labelStyle={{color: colors.PLACEHOLDER}}
            onPress={() => {
              action();
              setVisible();
            }}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CustomPopUp;
