import React, { useCallback } from 'react';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';

import Input from '../../components/Input';
import Sheet from '../../components/Sheet';
import Button from '../../components/Button';
import { Courier } from '../../types/packages';
import addButtonAtom from '../../atoms/add-button';
import GET_PACKAGES, { PackagesQuery } from '../../graphql/queries/packages';
import ADD_PACKAGE from '../../graphql/mutations/add-package';

export default function AddPackageSheet(): JSX.Element {
  const [addButtonCallback] = useRecoilState(addButtonAtom);

  const [addPackage, { loading }] = useMutation(ADD_PACKAGE);

  const handleOnClose = useCallback(() => {
    if (!addButtonCallback) {
      return;
    }

    // addButtonCallback.onHide();
  }, [addButtonCallback]);

  return (
    <Sheet onClose={handleOnClose}>
      <div className="text-center"><LocalShippingIcon fontSize="large" /></div>
      <h3 className="text-lg text-center font-medium mb-4">Add Package</h3>

      <Formik
        initialValues={{
          courier: Courier.Jinio,
          code: '',
        }}
        validationSchema={Yup.object({
            courier: Yup.string()
            .label('Courier')
            .oneOf(Object.values(Courier))
            .required(),
          code: Yup.string()
            .label('Tracking code')
            .required(),
        })}
        onSubmit={async ({ courier, code }, { setFieldError }) => {
          const { data } = await addPackage({
            variables: { courier, code },
            update: (cache, { data }) => {
              if (data.addPackage.errors) {
                return;
              }

              const pkg = data.addPackage.package;
              const result = cache.readQuery<PackagesQuery>({ query: GET_PACKAGES });
              cache.writeQuery({
                query: GET_PACKAGES,
                data: { packages: result ? result.packages.concat([pkg]) : null },
              });
            },
          });

          if (data.addPackage.errors) {
            setFieldError('code', data.addPackage.errors[0].message);
          }
        }}
      >
        <Form>
          <Input
            id="courier"
            name="courier"
            label="Courier"
            as="select"
            disabled={loading}
          >
            <option value={Courier.Jinio}>Jinio</option>
            <option value={Courier.Lazada}>Lazada</option>
            <option value={Courier.LBC}>LBC</option>
          </Input>
          <Input
            id="code"
            name="code"
            label="Tracking Code"
            placeholder=""
            disabled={loading}
          />
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </Form>
      </Formik>
    </Sheet>
  );
}
