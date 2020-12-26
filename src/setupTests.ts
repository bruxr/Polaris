// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import * as firebase from '@firebase/rules-unit-testing';

const projectId = 'polaris-test-app';

beforeAll(() => {
  firebase.initializeTestApp({
    projectId,
    auth: { uid: 'test', email: 'test@example.com' },
  });
});

beforeEach(async () => {
  await firebase.clearFirestoreData({
    projectId,
  });
});
