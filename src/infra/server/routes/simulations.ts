import { Router } from 'express';
import executeRule from '../execute-rule';

export const simulations = Router();

simulations.post('/loan', executeRule('loanSimulation'));
