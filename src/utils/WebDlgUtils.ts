import i18n from '@/i18n/i18n';
// import { BottomSheet, Dialog, Loading, Notify } from 'quasar';
import { loadingController, alertController, type ActionSheetButton, actionSheetController } from '@ionic/vue';
// let dialog: any = null;

let loading: any = null;

export const showPreloader = async (params?: { message?: string; duration?: number }) => {
  params = params || {};

  if (loading) {
    loading.message = params.message ?? undefined;
    return;
  }

  loading = await loadingController.create({
    message: params.message ?? undefined,
    duration: params.duration ?? 0,
  });

  await loading.present();
};

export const hidePreloader = () => {
  if (!loading) return;
  loading.dismiss();
  loading = null;
};

const sleepAsync = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


const { t } = i18n.global;

export const alert = async (message: string): Promise<void> => {
  hidePreloader();

  return new Promise((resolve) => {
    alertController.create({
      header: 'Alert',
      message: message,
      buttons: [
        {
          text: t('OK'),
          handler: () => {
            resolve();
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  });
};

export const alertWithRadioButtons = async (options: {
  header: string;
  message?: string;
  inputs: Array<{
    name: string;
    label: string;
    value: any;
    checked?: boolean;
  }>;
}): Promise<string | null> => {
  return new Promise((resolve) => {
    alertController.create({
      header: options.header,
      message: options.message || undefined,
      inputs: options.inputs.map((itm) => ({
        type: 'radio' as const,
        name: itm.name,
        label: itm.label,
        value: itm.value,
        checked: itm.checked || false,
      })),
      buttons: [
        {
          text: t('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            resolve(null);
          }
        },
        {
          text: t('OK'),
          handler: (data) => {
            resolve(data);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  });
};

export const confirm = async (
  message: string,
  param?: { okText?: string; cancelText?: string },
): Promise<boolean> => {
  param = param || {};
  const okText = param.okText || t('OK');
  const cancelText = param.cancelText || t('Cancel');

  hidePreloader();

  return new Promise((resolve) => {
    alertController.create({
      header: 'Confirm',
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            resolve(false);
          }
        },
        {
          text: okText,
          handler: () => {
            resolve(true);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  });
};

export const prompt = async (message: string, options?: { type?: string; placeholder?: string }): Promise<string | null> => {
  options = options || {};
  const type = options.type || 'text';
  const placeholder = options.placeholder || '';

  return new Promise((resolve) => {
    alertController.create({
      header: 'Input',
      message: message,
      inputs: [
        {
          name: 'input',
          type: type as any,
          placeholder: placeholder
        }
      ],
      buttons: [
        {
          text: t('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            resolve(null);
          }
        },
        {
          text: t('OK'),
          handler: (data) => {
            resolve(data.input || null);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  });
};

// export const showPreloaderWithExit = (params: {
//   message: string;
//   exitText?: string;
//   exitCallback?: () => void;
// }) => {
//   const message = params.message;
//   dialog = Dialog.create({
//     message: message,
//     progress: true,
//     persistent: true,
//     ok: params.exitText ? params.exitText : t('Cancel'),
//     cancel: false,
//     transitionHide: 'fade',
//     transitionShow: 'fade',
//   }).onOk(() => {
//     dialog.hide();
//     if (params.exitCallback != null) {
//       params.exitCallback();
//     }
//   });
// };

// export const confirm = async (
//   message: string,
//   param?: { okText?: string; cancelText?: string },
// ): Promise<boolean> => {
//   param = param || {};
//   const okText = param.okText || t('OK');
//   const cancelText = param.cancelText || t('Cancel');

//   hidePreloader();
//   return new Promise((resolve) => {
//     dialog = Dialog.create({
//       message: message,
//       persistent: true,
//       html: true,
//       ok: okText,
//       cancel: cancelText,
//     })
//       .onOk(() => {
//         resolve(true);
//       })
//       .onCancel(() => {
//         resolve(false);
//       });
//   });
// };

// export const prompt = async (message: string, options?: { type?: any }): Promise<string | null> => {
//   options = options || {};
//   const type = options.type || 'text';
//   return new Promise((resolve) => {
//     dialog = Dialog.create({
//       message: message,
//       persistent: true,
//       html: true,
//       prompt: {
//         model: '',
//         type: type,
//       },
//       ok: t('OK'),
//       cancel: t('Cancel'),
//     })
//       .onOk((data) => {
//         resolve(data);
//       })
//       .onCancel(() => {
//         resolve(null);
//       });
//   });
// };

// export const bottomSheet = async (params: {
//   message: string;
//   actions: Array<{
//     label: string;
//     icon: string;
//     color?: string;
//     classes?: string;
//     click: () => void;
//   }>;
// }) => {
//   return new Promise(() => {
//     const actions = params.actions.map((itm, itmIndex) => {
//       return { ...itm, id: itmIndex, avatar: '' };
//     });
//     BottomSheet.create({
//       message: params.message,
//       actions: actions,
//     }).onOk((action) => {
//       actions[action.id].click();
//     });
//   });
// };

// export const notify = (params: { msg: string; timeout: number }) => {
//   Notify.create({
//     message: params.msg,
//     timeout: params.timeout,
//     badgeStyle: 'opacity: 0',
//   });
// };


  export const showActionSheet = async (options: {
    header: string;
    buttons: Array<ActionSheetButton>;
  }) => {
    const actionSheet = await actionSheetController.create({
      header: options.header,
      buttons: options.buttons,
    });
    await actionSheet.present();
  };
