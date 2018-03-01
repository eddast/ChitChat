import React from "react";
import { shallow } from "enzyme";
import NicknameChoice from "./NicknameChoice";
import { SocketIO, Server } from "mock-socket";
import Service from '../../../../services/API';
import { Redirect } from 'react-router';

jest.useFakeTimers();

describe("Nickname Prompt Tests", () => {

  // Mock context; i.e. server + redirect tool
  const server = Service;
  server.connect();
  const context = {
    serverAPI : {
      server: server
    },
    routeTools : {
      redirect: Redirect
    }
  }

  // Get component
  const component = shallow(<NicknameChoice/>, { context });
  const smth = jest.mock('../../../../services/API');
  smth.setNickname = () => {
    return new Promise((resolve) => {
      this.socket.emit('adduser', nickname, (nameOK) => {
          resolve(nameOK);
      });
    });
  }

  /*** TESTS ON NICKNAMECHOICE ***/

  // Tests whether input value updates correctly
  it("Update Input Value", () => {
    component.find('input').simulate('change', {target: {value: 'nickname'}});
    expect(component.state().inputValue).toEqual('nickname');
  });

  // Tests whether nickname validation is OK
  it("Check Invalid Nickname", () => {
    component.find('input').simulate('change', {target: {value: 'fyrirmyndarveruleikaflóttamaður'}});
    component.find('button').simulate('click');
    
    expect(component.state().nicknameAvailable).toEqual(false);
  });

});