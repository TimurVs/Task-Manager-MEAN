import { Component, OnInit } from '@angular/core';
import {TaskService} from "../../task-service.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: any[];
  tasks: any[];

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
    this.lists = [];
    this.tasks = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.taskService.getTasks(params['listId']).subscribe((tasks: any)=>{
          this.tasks = tasks;
        })
    }
    )
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    })
  }
}
