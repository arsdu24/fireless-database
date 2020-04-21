import { Entity, PrimaryKey, ForeignKey, Property } from './entity';
import { HasOne } from './relations';
import { Controller } from './controller.decorator';
import { OnCreate, OnDelete, OnUpdate } from './controller-handler.decorator';
import { Event } from './controller-handler-param.decorator';
import { Module } from './module.decorator';

export {
  Module,
  Controller,
  Entity,
  Event,
  OnCreate,
  OnUpdate,
  OnDelete,
  Property,
  PrimaryKey,
  ForeignKey,
  HasOne,
};

export const DB = Object.seal({
  Module,
  Controller,
  Entity,
  Event,
  OnCreate,
  OnUpdate,
  OnDelete,
  Property,
  PrimaryKey,
  ForeignKey,
  HasOne,
});
