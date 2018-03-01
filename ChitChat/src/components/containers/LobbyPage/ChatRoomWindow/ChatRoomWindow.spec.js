import React from "react";
import { shallow } from "enzyme";
import { SocketIO, Server } from "mock-socket";
import ChatRoomWindow from "./ChatRoomWindow";
import propTypes from "prop-types";

jest.useFakeTimers();

describe("Chatroom Window tests", () => {
  it("should be 12", () => {
    expect(12).toBe(12);
  });
});
