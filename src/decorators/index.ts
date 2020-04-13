import { Controller } from './controller.decorator';
import { OnCreate, OnDelete, OnUpdate } from './controller-handler.decorator';
import { Event } from './controller-handler-param.decorator';
import { Entity } from './entity.decorator';
import { Column } from './entity-prop.decorator';
import { Module } from './module.decorator';

export {
  Module,
  Controller,
  Entity,
  Event,
  OnCreate,
  OnUpdate,
  OnDelete,
  Column,
};

export const DB = Object.seal({
  Module,
  Controller,
  Entity,
  Event,
  OnCreate,
  OnUpdate,
  OnDelete,
  Column,
});
